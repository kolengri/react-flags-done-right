import { lazy, Suspense, type ComponentType } from "react";
import type { SVGProps } from "react";
import { Skeleton } from "./skeleton";
import { Fallback } from "./fallback";
import { flagComponentLoaders, type FlagCode } from "./flags";

/**
 * Cache for lazy components to avoid re-creating them.
 * This improves performance by reusing already loaded components.
 */
const componentCache = new Map<
  string,
  ComponentType<SVGProps<SVGSVGElement>>
>();

/**
 * Gets or creates a lazy-loaded flag component for the given flag code.
 *
 * This function implements a caching mechanism to avoid re-creating lazy components
 * for the same flag code. If a component loader doesn't exist for the code,
 * it returns a fallback component. If loading fails, it also returns a fallback.
 *
 * @param code - The flag code (e.g., "us", "gb", "fr")
 * @returns A React component that renders the flag SVG
 *
 * @example
 * ```tsx
 * const UsFlag = getLazyFlagComponent("us");
 * <UsFlag width={100} height={100} />
 * ```
 */
function getLazyFlagComponent(
  code: FlagCode
): ComponentType<SVGProps<SVGSVGElement>> {
  const componentName = code;

  if (componentCache.has(componentName)) {
    return componentCache.get(componentName)!;
  }

  // Check if component loader exists
  const loader = flagComponentLoaders[componentName];
  if (!loader) {
    console.warn(
      `Flag component not found for code: ${code} (component: ${componentName})`
    );
    // Return a fallback component directly (not lazy)
    const FallbackComponent = (props: SVGProps<SVGSVGElement>) => (
      <Fallback code={code} {...props} />
    );
    componentCache.set(componentName, FallbackComponent);
    return FallbackComponent;
  }

  // Create lazy component using the loader function
  // This ensures true lazy loading - component is only loaded when needed
  const LazyComponent = lazy(async () => {
    try {
      // Call the loader function to dynamically import the component
      const module = await loader();
      return module;
    } catch (error) {
      console.error(
        `Failed to load flag component for code: ${code} (component: ${componentName})`,
        error
      );
      // Return a fallback component
      return {
        default: (props: SVGProps<SVGSVGElement>) => (
          <Fallback code={code} {...props} />
        ),
      };
    }
  });

  componentCache.set(componentName, LazyComponent);
  return LazyComponent;
}

/**
 * Props for the Flag component.
 *
 * @extends SVGProps<SVGSVGElement> - All standard SVG props are supported
 */
export interface FlagProps extends SVGProps<SVGSVGElement> {
  /**
   * The flag code to display (e.g., "us", "gb", "fr").
   * Must be a valid FlagCode from the flags index.
   */
  code: FlagCode;
  /**
   * Optional custom fallback component to show while the flag is loading.
   * If not provided, a default Skeleton component will be used.
   */
  fallback?: React.ReactNode;
}

/**
 * Flag component that renders country flags with lazy loading support.
 *
 * This component uses React.lazy() to dynamically load flag components only when needed,
 * improving initial bundle size. It wraps the lazy component in a Suspense boundary
 * to handle loading states gracefully.
 *
 * @param props - Flag component props
 * @param props.code - The flag code to display (required)
 * @param props.fallback - Optional custom fallback component (defaults to Skeleton)
 * @param props - All other props are passed through to the underlying SVG element
 *
 * @returns A React component that renders the flag with lazy loading
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Flag code="us" width={100} height={100} />
 *
 * // With custom fallback
 * <Flag
 *   code="gb"
 *   width={200}
 *   height={150}
 *   fallback={<div>Loading...</div>}
 * />
 *
 * // With SVG props
 * <Flag
 *   code="fr"
 *   className="flag-icon"
 *   style={{ border: "1px solid #ccc" }}
 * />
 * ```
 */
export function Flag({ code, fallback, ...props }: FlagProps) {
  const LazyFlag = getLazyFlagComponent(code);

  return (
    <Suspense fallback={fallback || <Skeleton {...props} />}>
      <LazyFlag {...props} />
    </Suspense>
  );
}

export default Flag;
