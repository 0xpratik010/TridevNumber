import React from "react";
import { cn } from "@/lib/utils";

/**
 * CenteredNumberDisplay
 *
 * Props:
 *  - value: string in the format "XXX-YY-ZZZ" (e.g. "125-45-567") or "XXX-Y" (e.g., "789-8").
 *  - size: 'base' | 'small'. Controls the font size and padding. Defaults to 'base'.
 *  - className: optional extra classes for the wrapper
 *
 * Renders a 3x3 layout where:
 *  - Left column shows the 3 digits of the first group vertically
 *  - Right column shows the 3 digits of the third group vertically (if present)
 *  - Middle column shows the middle group (YY or Y) centered in the middle row and larger
 *
 * Uses Tailwind CSS for styling. Default export is the component.
 */

export default function CenteredNumberDisplay({
  value = "125-45-567",
  size = "base",
  className = "",
}) {
  const parts = String(value).split("-");
  const isComplexFormat = parts.length === 3 && parts[0].length === 3 && parts[2].length === 3;
  const isSimpleFormat = parts.length === 2 && parts[0].length === 3;

  if (!isComplexFormat && !isSimpleFormat) {
    return (
      <div className={`p-4 rounded-md border border-red-300 bg-red-50 text-red-800 ${className}`}>
        <strong>Invalid format.</strong> Expected <code>XXX-YY-ZZZ</code> or <code>XXX-Y</code>. Got:{" "}
        <code>{value}</code>
      </div>
    );
  }

  const left = parts[0].split(""); // ['1','2','5']
  const middle = parts[1]; // '45' or '8'
  const right = isComplexFormat ? parts[2].split("") : ["", "", ""]; // ['5','6','7'] or empty

  return (
    <div
      className={cn(
        "inline-block bg-white/5 rounded-xl shadow-sm",
        size === "base" ? "p-1" : "p-0.5",
        className
      )}
      aria-label={`Number display ${value}`}
    >
      {/* Outer grid: 3 rows x 3 columns */}
      <div
        className={cn(
          "grid grid-rows-3 grid-cols-3 items-center",
          size === "base" ? "gap-x-2" : "gap-x-1"
        )}
        style={{ minWidth: size === "base" ? 90 : "auto" }}
      >
        {/* Row 1 */}
        <div className={cn("flex justify-start items-center font-medium text-muted-foreground", size === 'base' ? 'text-base' : 'text-xs')}>{left[0]}</div>
        <div className="flex justify-center items-center">{/* empty on first row */}</div>
        <div className={cn("flex justify-end items-center font-medium text-muted-foreground", size === 'base' ? 'text-base' : 'text-xs')}>{right[0]}</div>

        {/* Row 2 (middle row) */}
        <div className={cn("flex justify-start items-center font-medium text-muted-foreground", size === 'base' ? 'text-base' : 'text-xs')}>{left[1]}</div>

        {/* Center cell: the middle number — make it big and centered */}
        <div className="flex justify-center items-center">
          <div
            className={cn(
              "rounded-md shadow-md border border-slate-200/20 text-center bg-background/50",
              size === "base" ? "px-2 py-0.5" : "px-1"
            )}
          >
            <div
              className={cn(
                "font-extrabold leading-tight text-golden bg-gradient-golden bg-clip-text text-transparent",
                size === "base" ? "text-xl md:text-2xl" : "text-lg"
              )}
            >
              {middle}
            </div>
          </div>
        </div>

        <div className={cn("flex justify-end items-center font-medium text-muted-foreground", size === 'base' ? 'text-base' : 'text-xs')}>{right[1]}</div>

        {/* Row 3 */}
        <div className={cn("flex justify-start items-center font-medium text-muted-foreground", size === 'base' ? 'text-base' : 'text-xs')}>{left[2]}</div>
        <div className="flex justify-center items-center">{/* empty on third row */}</div>
        <div className={cn("flex justify-end items-center font-medium text-muted-foreground", size === 'base' ? 'text-base' : 'text-xs')}>{right[2]}</div>
      </div>

      {/* Small helper caption */}
      <div className="mt-1 text-xs text-slate-500 text-center">{value}</div>
    </div>
  );
}