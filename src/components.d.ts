/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface BugTracer {
        /**
          * Api URL
         */
        "api": string;
        /**
          * Project ID
         */
        "projectid": string;
    }
}
declare global {
    interface HTMLBugTracerElement extends Components.BugTracer, HTMLStencilElement {
    }
    var HTMLBugTracerElement: {
        prototype: HTMLBugTracerElement;
        new (): HTMLBugTracerElement;
    };
    interface HTMLElementTagNameMap {
        "bug-tracer": HTMLBugTracerElement;
    }
}
declare namespace LocalJSX {
    interface BugTracer {
        /**
          * Api URL
         */
        "api"?: string;
        /**
          * Project ID
         */
        "projectid"?: string;
    }
    interface IntrinsicElements {
        "bug-tracer": BugTracer;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "bug-tracer": LocalJSX.BugTracer & JSXBase.HTMLAttributes<HTMLBugTracerElement>;
        }
    }
}
