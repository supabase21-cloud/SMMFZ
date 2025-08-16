module.exports = {

"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[project]/src/hooks/use-toast.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "reducer": (()=>reducer),
    "toast": (()=>toast),
    "useToast": (()=>useToast)
});
// Inspired by react-hot-toast library
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST"
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case "DISMISS_TOAST":
            {
                const { toastId } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: "UPDATE_TOAST",
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: "DISMISS_TOAST",
            toastId: id
        });
    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(memoryState);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        listeners.push(setState);
        return ()=>{
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: "DISMISS_TOAST",
                toastId
            })
    };
}
;
}}),
"[project]/src/lib/utils.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "cn": (()=>cn)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}}),
"[project]/src/components/ui/toast.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Toast": (()=>Toast),
    "ToastAction": (()=>ToastAction),
    "ToastClose": (()=>ToastClose),
    "ToastDescription": (()=>ToastDescription),
    "ToastProvider": (()=>ToastProvider),
    "ToastTitle": (()=>ToastTitle),
    "ToastViewport": (()=>ToastViewport)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-toast/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const ToastProvider = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Provider"];
const ToastViewport = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Viewport"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, this));
ToastViewport.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Viewport"].displayName;
const toastVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full", {
    variants: {
        variant: {
            default: "border bg-background text-foreground",
            destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
const Toast = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, variant, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(toastVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
});
Toast.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"].displayName;
const ToastAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Action"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, this));
ToastAction.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Action"].displayName;
const ToastClose = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600", className),
        "toast-close": "",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/toast.tsx",
            lineNumber: 86,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 77,
        columnNumber: 3
    }, this));
ToastClose.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"].displayName;
const ToastTitle = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 95,
        columnNumber: 3
    }, this));
ToastTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"].displayName;
const ToastDescription = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm opacity-90", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 107,
        columnNumber: 3
    }, this));
ToastDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"].displayName;
;
}}),
"[project]/src/components/ui/toaster.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Toaster": (()=>Toaster)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/toast.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function Toaster() {
    const { toasts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastProvider"], {
        children: [
            toasts.map(function({ id, title, description, action, ...props }) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toast"], {
                    ...props,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-1",
                            children: [
                                title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastTitle"], {
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/toaster.tsx",
                                    lineNumber: 22,
                                    columnNumber: 25
                                }, this),
                                description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastDescription"], {
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/toaster.tsx",
                                    lineNumber: 24,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/toaster.tsx",
                            lineNumber: 21,
                            columnNumber: 13
                        }, this),
                        action,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastClose"], {}, void 0, false, {
                            fileName: "[project]/src/components/ui/toaster.tsx",
                            lineNumber: 28,
                            columnNumber: 13
                        }, this)
                    ]
                }, id, true, {
                    fileName: "[project]/src/components/ui/toaster.tsx",
                    lineNumber: 20,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastViewport"], {}, void 0, false, {
                fileName: "[project]/src/components/ui/toaster.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/toaster.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/punycode [external] (punycode, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[externals]/events [external] (events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[externals]/net [external] (net, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}}),
"[externals]/tls [external] (tls, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/buffer [external] (buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}}),
"[project]/src/lib/supabase.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "supabase": (()=>supabase)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [app-ssr] (ecmascript) <locals>");
;
const supabaseUrl = "https://rzzwuqpnimflfvtthexu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6end1cXBuaW1mbGZ2dHRoZXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNDk0MDMsImV4cCI6MjA3MDgyNTQwM30.w_eJfIbJKCx63scIhXUCPgt8L0HtN8B1y1H-_xvk5P0";
let supabase;
if ("TURBOPACK compile-time truthy", 1) {
    supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
} else {
    "TURBOPACK unreachable";
}
;
}}),
"[project]/src/types/index.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
;
}}),
"[project]/src/ai/flows/data:d2ee56 [app-ssr] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"40bd7c16089a55e72f14d7a1ca980151aa41f52c84":"sendNewOrderNotification"},"src/ai/flows/notification-flow.ts",""] */ __turbopack_context__.s({
    "sendNewOrderNotification": (()=>sendNewOrderNotification)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var sendNewOrderNotification = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("40bd7c16089a55e72f14d7a1ca980151aa41f52c84", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "sendNewOrderNotification"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbm90aWZpY2F0aW9uLWZsb3cudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXG4ndXNlIHNlcnZlcic7XG5cbi8qKlxuICogQGZpbGVPdmVydmlldyBBIGZsb3cgZm9yIHNlbmRpbmcgcHVzaCBub3RpZmljYXRpb25zIGZvciBuZXcgb3JkZXJzLlxuICpcbiAqIC0gc2VuZE5ld09yZGVyTm90aWZpY2F0aW9uIC0gQSBmdW5jdGlvbiB0aGF0IHNlbmRzIGEgbm90aWZpY2F0aW9uIHRvIHRoZSBhZG1pbi5cbiAqIC0gTmV3T3JkZXJOb3RpZmljYXRpb25JbnB1dCAtIFRoZSBpbnB1dCB0eXBlIGZvciB0aGUgbm90aWZpY2F0aW9uIGZ1bmN0aW9uLlxuICovXG5cbmltcG9ydCB7IGFpIH0gZnJvbSAnQC9haS9nZW5raXQnO1xuaW1wb3J0IHsgc3VwYWJhc2UgfSBmcm9tICdAL2xpYi9zdXBhYmFzZSc7XG5pbXBvcnQgeyB6IH0gZnJvbSAnZ2Vua2l0JztcblxuY29uc3QgQURNSU5fRU1BSUwgPSAnYWRtaW5AZ21haWwuY29tJztcblxuZXhwb3J0IGNvbnN0IE5ld09yZGVyTm90aWZpY2F0aW9uSW5wdXRTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIG9yZGVySWQ6IHouc3RyaW5nKCkuZGVzY3JpYmUoJ1RoZSBJRCBvZiB0aGUgbmV3IG9yZGVyLicpLFxuICB1c2VybmFtZTogei5zdHJpbmcoKS5kZXNjcmliZSgnVGhlIHVzZXJuYW1lIG9mIHRoZSBjdXN0b21lciB3aG8gcGxhY2VkIHRoZSBvcmRlci4nKSxcbiAgc2VydmljZVR5cGU6IHouc3RyaW5nKCkuZGVzY3JpYmUoJ1RoZSB0eXBlIG9mIHNlcnZpY2Ugb3JkZXJlZC4nKSxcbiAgcGxhdGZvcm06IHouc3RyaW5nKCkuZGVzY3JpYmUoJ1RoZSBwbGF0Zm9ybSBmb3Igd2hpY2ggdGhlIHNlcnZpY2Ugd2FzIG9yZGVyZWQuJyksXG59KTtcbmV4cG9ydCB0eXBlIE5ld09yZGVyTm90aWZpY2F0aW9uSW5wdXQgPSB6LmluZmVyPHR5cGVvZiBOZXdPcmRlck5vdGlmaWNhdGlvbklucHV0U2NoZW1hPjtcblxuLy8gVGhpcyBpcyBhIHNpbXBsZSB3cmFwcGVyIGZ1bmN0aW9uIHRvIGNhbGwgdGhlIGZsb3cuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZE5ld09yZGVyTm90aWZpY2F0aW9uKGlucHV0OiBOZXdPcmRlck5vdGlmaWNhdGlvbklucHV0KTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IG5ld09yZGVyTm90aWZpY2F0aW9uRmxvdyhpbnB1dCk7XG59XG5cbi8vIERlZmluZSB0aGUgR2Vua2l0IGZsb3dcbmNvbnN0IG5ld09yZGVyTm90aWZpY2F0aW9uRmxvdyA9IGFpLmRlZmluZUZsb3coXG4gIHtcbiAgICBuYW1lOiAnbmV3T3JkZXJOb3RpZmljYXRpb25GbG93JyxcbiAgICBpbnB1dFNjaGVtYTogTmV3T3JkZXJOb3RpZmljYXRpb25JbnB1dFNjaGVtYSxcbiAgICBvdXRwdXRTY2hlbWE6IHoudm9pZCgpLFxuICB9LFxuICBhc3luYyAoaW5wdXQpID0+IHtcbiAgICAvLyAxLiBHZXQgdGhlIGFkbWluJ3MgRkNNIHRva2VuIGZyb20gdGhlIGRhdGFiYXNlXG4gICAgY29uc3QgeyBkYXRhOiBhZG1pblVzZXIsIGVycm9yOiBhZG1pbkVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuICAgICAgLmZyb20oJ3VzZXJzJylcbiAgICAgIC5zZWxlY3QoJ2ZjbV90b2tlbicpXG4gICAgICAuZXEoJ2VtYWlsJywgQURNSU5fRU1BSUwpXG4gICAgICAuc2luZ2xlKCk7XG5cbiAgICBpZiAoYWRtaW5FcnJvciB8fCAhYWRtaW5Vc2VyIHx8ICFhZG1pblVzZXIuZmNtX3Rva2VuKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQ291bGQgbm90IGZpbmQgYWRtaW4gdXNlciBvciBhZG1pbidzIEZDTSB0b2tlbi5cIiwgYWRtaW5FcnJvcik7XG4gICAgICByZXR1cm47IC8vIEV4aXQgaWYgbm8gdG9rZW4gaXMgZm91bmRcbiAgICB9XG5cbiAgICBjb25zdCBmY21Ub2tlbiA9IGFkbWluVXNlci5mY21fdG9rZW47XG5cbiAgICAvLyAyLiBQcmVwYXJlIHRoZSBub3RpZmljYXRpb24gcGF5bG9hZCBmb3IgRmlyZWJhc2UgQ2xvdWQgTWVzc2FnaW5nIChGQ00pXG4gICAgY29uc3Qgbm90aWZpY2F0aW9uUGF5bG9hZCA9IHtcbiAgICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgdG9rZW46IGZjbVRva2VuLFxuICAgICAgICBub3RpZmljYXRpb246IHtcbiAgICAgICAgICB0aXRsZTogJ/Cfk6YgTmV3IE9yZGVyIFJlY2VpdmVkIScsXG4gICAgICAgICAgYm9keTogYCR7aW5wdXQudXNlcm5hbWV9IG9yZGVyZWQgJHtpbnB1dC5zZXJ2aWNlVHlwZX0gZm9yICR7aW5wdXQucGxhdGZvcm19LmAsXG4gICAgICAgIH0sXG4gICAgICAgIHdlYnB1c2g6IHtcbiAgICAgICAgICBmY21fb3B0aW9uczoge1xuICAgICAgICAgICAgLy8gVGhpcyBsaW5rIHdpbGwgb3BlbiB3aGVuIHRoZSB1c2VyIGNsaWNrcyB0aGUgbm90aWZpY2F0aW9uXG4gICAgICAgICAgICBsaW5rOiBgL2FkbWluL29yZGVyc2AsIFxuICAgICAgICAgIH0sXG4gICAgICAgICAgbm90aWZpY2F0aW9uOiB7XG4gICAgICAgICAgICAgLy8gWW91IGNhbiBhZGQgYW4gaWNvbiBVUkwgaGVyZSBpZiB5b3UgaGF2ZSBvbmVcbiAgICAgICAgICAgICBpY29uOiAnaHR0cHM6Ly9pLnBvc3RpbWcuY2MvaFhYeHBLM2svSU1HLTIwMjUwODA4LVdBMDI2NS5qcGcnLFxuICAgICAgICAgICAgIC8vIEFjdGlvbnMgYWRkIGJ1dHRvbnMgdG8gdGhlIG5vdGlmaWNhdGlvblxuICAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ3ZpZXdfb3JkZXInLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1ZpZXcgT3JkZXInXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG5cbiAgICAvLyAzLiBTZW5kIHRoZSBub3RpZmljYXRpb24gdXNpbmcgdGhlIEZDTSBBUElcbiAgICAvLyBJTVBPUlRBTlQ6IFRoaXMgcmVxdWlyZXMgc2V0dGluZyB1cCBhdXRoZW50aWNhdGlvbiB3aXRoIEdvb2dsZSBDbG91ZC5cbiAgICAvLyBXZSBuZWVkIHRvIHByb3ZpZGUgdGhlIGBmY21fZW5kcG9pbnRgIGFuZCBgcHJvamVjdF9pZGAgZnJvbSB5b3VyIEZpcmViYXNlIHByb2plY3QuXG4gICAgXG4gICAgY29uc3QgZmNtRW5kcG9pbnQgPSBgaHR0cHM6Ly9mY20uZ29vZ2xlYXBpcy5jb20vdjEvcHJvamVjdHMvJHtwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19GSVJFQkFTRV9QUk9KRUNUX0lEfS9tZXNzYWdlczpzZW5kYDtcblxuICAgIHRyeSB7XG4gICAgICAgIC8vIFdlIGFyZSB1c2luZyBgZmV0Y2hgIHRvIGNhbGwgdGhlIEZDTSBSRVNUIEFQSS5cbiAgICAgICAgLy8gVGhpcyByZXF1aXJlcyBnZXR0aW5nIGFuIGFjY2VzcyB0b2tlbiBmb3IgYXV0aGVudGljYXRpb24uXG4gICAgICAgIC8vIFRoZSBgZ29vZ2xlQUlgIHBsdWdpbiBpbiBHZW5raXQgY2FuIGhlbHAgdXMgZ2V0IHRoaXMgdG9rZW4gYXV0b21hdGljYWxseS5cbiAgICAgICAgY29uc3QgYXV0aCA9IGF3YWl0IGFpLmdldFBsdWdpbignZ29vZ2xlYWknKT8uZ2V0QXV0aCgpO1xuICAgICAgICBpZiAoIWF1dGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGdldCBHb29nbGUgYXV0aGVudGljYXRpb24gZm9yIEZDTS4nKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBoZWFkZXJzID0gYXdhaXQgYXV0aC5nZXRIZWFkZXJzKCk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGZjbUVuZHBvaW50LCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAuLi5oZWFkZXJzLFxuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkobm90aWZpY2F0aW9uUGF5bG9hZCksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yQm9keSA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRkNNIHJlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzICR7cmVzcG9uc2Uuc3RhdHVzfTogJHtlcnJvckJvZHl9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygnU3VjY2Vzc2Z1bGx5IHNlbnQgRkNNIG5vdGlmaWNhdGlvbi4nKTtcblxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIHNlbmRpbmcgdGhlIEZDTSBub3RpZmljYXRpb246JywgZXJyb3IpO1xuICAgIH1cbiAgfVxuKTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoibVRBeUJzQiJ9
}}),
"[project]/src/lib/data.ts [app-ssr] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// This file connects to Supabase for data management.
__turbopack_context__.s({
    "addService": (()=>addService),
    "clearSession": (()=>clearSession),
    "deleteService": (()=>deleteService),
    "getOrders": (()=>getOrders),
    "getPrices": (()=>getPrices),
    "getServiceById": (()=>getServiceById),
    "getServices": (()=>getServices),
    "getSession": (()=>getSession),
    "getUser": (()=>getUser),
    "getUserByUsername": (()=>getUserByUsername),
    "getUsers": (()=>getUsers),
    "placeOrder": (()=>placeOrder),
    "registerUser": (()=>registerUser),
    "setSession": (()=>setSession),
    "setUserFunds": (()=>setUserFunds),
    "updateOrderStatus": (()=>updateOrderStatus),
    "updatePrices": (()=>updatePrices),
    "updateService": (()=>updateService),
    "updateServiceAvailability": (()=>updateServiceAvailability),
    "updateUserFunds": (()=>updateUserFunds)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ai$2f$flows$2f$data$3a$d2ee56__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/ai/flows/data:d2ee56 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/index.ts [app-ssr] (ecmascript)");
"use client";
;
;
const getUser = async (email)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("users").select("*").eq("email", email).single();
    if (error && error.code !== 'PGRST116') {
        console.error("Error getting user:", error);
        return null;
    }
    return data;
};
const getUserByUsername = async (username)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('users').select('*').eq('username', username).single();
    if (error && error.code !== 'PGRST116') {
        console.error("Error getting user by username:", error);
        return null;
    }
    return data;
};
const registerUser = async (newUser)=>{
    // Step 1: Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signUp({
        email: newUser.email,
        password: newUser.password
    });
    if (authError) {
        console.error("Supabase auth signup error:", authError.message);
        return {
            user: null,
            error: authError.message
        };
    }
    if (!authData.user) {
        console.error("Supabase auth signup did not return a user.");
        return {
            user: null,
            error: "Could not create user."
        };
    }
    // Step 2: The database trigger 'on_auth_user_created' will automatically
    // create an entry in the 'public.users' table. We no longer need to do it from client-side code.
    // We just need to fetch the newly created user profile.
    // Let's try to fetch the user profile a few times, as the trigger might have a slight delay.
    for(let i = 0; i < 5; i++){
        const { data: dbData, error: dbError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("users").select("*").eq("id", authData.user.id).single();
        if (dbData) {
            return {
                user: dbData,
                error: undefined
            };
        }
        // Wait for 500ms before retrying
        await new Promise((resolve)=>setTimeout(resolve, 500));
    }
    console.error("Could not retrieve user profile from database after registration.");
    return {
        user: null,
        error: "Could not save or retrieve user profile."
    };
};
const updateUserFunds = async (email, amount)=>{
    const user = await getUser(email);
    if (!user) return null;
    const newFunds = user.funds + amount;
    return setUserFunds(email, newFunds);
};
const setUserFunds = async (email, newBalance)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('users').update({
        funds: newBalance
    }).eq('email', email).select().single();
    if (error) {
        console.error("Error setting user funds:", error);
        return null;
    }
    return data;
};
const getServices = async ()=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('services').select('*').order('platform').order('type');
    if (error) {
        console.error("Error getting services:", JSON.stringify(error, null, 2));
        return [];
    }
    return data || [];
};
const getServiceById = async (id)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('services').select('*').eq('id', id).single();
    if (error) {
        console.error("Error getting service by ID:", error);
        return undefined;
    }
    return data;
};
const addService = async (servicesToAdd)=>{
    const newServices = servicesToAdd.map((data)=>({
            ...data,
            platform: data.platform.toLowerCase(),
            type: data.type.toLowerCase(),
            available: true,
            user_cooldown_hours: data.price === 0 ? data.user_cooldown_hours || 0 : 0,
            link_cooldown_hours: data.price === 0 ? data.link_cooldown_hours || 0 : 0
        }));
    const { data: result, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('services').insert(newServices).select();
    if (error) {
        console.error("Error adding services:", error);
        return null;
    }
    return result;
};
const updateService = async (id, data)=>{
    const serviceUpdate = {
        ...data,
        platform: data.platform?.toLowerCase(),
        type: data.type?.toLowerCase()
    };
    // Ensure cooldowns are set to 0 if price is not 0
    if (data.price !== 0) {
        serviceUpdate.user_cooldown_hours = 0;
        serviceUpdate.link_cooldown_hours = 0;
    }
    const { data: result, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('services').update(serviceUpdate).eq('id', id).select().single();
    if (error) {
        console.error("Error updating service:", error);
        return null;
    }
    return result;
};
const updateServiceAvailability = async (id, available)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('services').update({
        available
    }).eq('id', id).select().single();
    if (error) {
        console.error("Error updating service availability:", error);
        return null;
    }
    return data;
};
const deleteService = async (id)=>{
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('services').delete().eq('id', id);
    if (error) {
        console.error("Error deleting service:", error);
        return {
            success: false,
            error: error.message
        };
    }
    return {
        success: true
    };
};
const getOrders = async ()=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('orders').select('*').order('created_at', {
        ascending: false
    });
    if (error) {
        console.error("Error getting orders:", JSON.stringify(error, null, 2));
        return [];
    }
    return data?.map((o)=>({
            id: o.id,
            userEmail: o.user_email,
            username: o.username,
            serviceId: o.service_id,
            platform: o.platform,
            serviceType: o.service_type,
            quantity: o.quantity,
            price: o.price,
            status: o.status,
            link: o.url,
            createdAt: o.created_at,
            comments: Array.isArray(o.comments) ? o.comments : null
        })) || [];
};
const placeOrder = async (newOrder)=>{
    const user = await getUser(newOrder.userEmail);
    const service = await getServiceById(newOrder.serviceId);
    if (!user || !service || !service.available) {
        return {
            success: false,
            error: 'User or service not found, or service is unavailable.'
        };
    }
    const totalPrice = newOrder.quantity * service.price;
    if (user.funds < totalPrice) {
        return {
            success: false,
            error: 'Insufficient funds.'
        };
    }
    const isCommentService = service.type.toLowerCase().includes('comment');
    if (!isCommentService) {
        if (newOrder.quantity < service.min || newOrder.quantity > service.max) {
            return {
                success: false,
                error: `Quantity must be between ${service.min} and ${service.max}.`
            };
        }
    } else {
        if (newOrder.quantity === 0 || !newOrder.comments || newOrder.comments.length === 0) {
            return {
                success: false,
                error: 'Comments cannot be empty for this service.'
            };
        }
    }
    // Check for 0 price service cooldowns
    if (totalPrice === 0) {
        const { user_cooldown_hours, link_cooldown_hours } = service;
        if (user_cooldown_hours > 0) {
            const userCooldownAgo = new Date(Date.now() - user_cooldown_hours * 60 * 60 * 1000).toISOString();
            const { data: recentUserFreeOrder, error: userFreeOrderError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('orders').select('created_at').eq('user_email', newOrder.userEmail).eq('price', 0).gt('created_at', userCooldownAgo).order('created_at', {
                ascending: false
            }).limit(1).single();
            if (userFreeOrderError && userFreeOrderError.code !== 'PGRST116') {
                console.error("Error checking for recent user free orders:", userFreeOrderError);
                return {
                    success: false,
                    error: 'Could not verify free order eligibility.'
                };
            }
            if (recentUserFreeOrder) {
                const cooldownExpiry = new Date(recentUserFreeOrder.created_at).getTime() + user_cooldown_hours * 60 * 60 * 1000;
                return {
                    success: false,
                    error: `You must wait ${user_cooldown_hours} hour(s) between free orders.`,
                    errorType: 'USER_COOLDOWN',
                    cooldownExpiry
                };
            }
        }
        if (link_cooldown_hours > 0) {
            const linkCooldownAgo = new Date(Date.now() - link_cooldown_hours * 60 * 60 * 1000).toISOString();
            const { data: recentLinkFreeOrder, error: linkFreeOrderError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('orders').select('created_at').eq('url', newOrder.link) // Check against the link for this specific service
            .eq('service_id', service.id).eq('price', 0).gt('created_at', linkCooldownAgo).order('created_at', {
                ascending: false
            }).limit(1).single();
            if (linkFreeOrderError && linkFreeOrderError.code !== 'PGRST116') {
                console.error("Error checking for recent link free orders:", linkFreeOrderError);
                return {
                    success: false,
                    error: 'Could not verify free order eligibility.'
                };
            }
            if (recentLinkFreeOrder) {
                const cooldownExpiry = new Date(recentLinkFreeOrder.created_at).getTime() + link_cooldown_hours * 60 * 60 * 1000;
                return {
                    success: false,
                    error: `User is on cooldown for this free service and link.`,
                    errorType: 'LINK_COOLDOWN',
                    cooldownExpiry
                };
            }
        }
    }
    const orderData = {
        user_email: newOrder.userEmail,
        username: user.username,
        service_id: newOrder.serviceId,
        platform: service.platform,
        service_type: service.type,
        quantity: newOrder.quantity,
        price: totalPrice,
        url: newOrder.link,
        status: "Pending"
    };
    if (newOrder.comments && newOrder.comments.length > 0) {
        orderData.comments = newOrder.comments;
    }
    const { data: createdOrder, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('orders').insert(orderData).select().single();
    if (error) {
        console.error("Error placing order:", JSON.stringify(error, null, 2));
        return {
            success: false,
            error: 'Failed to create order in database.'
        };
    }
    // After successful order, deduct funds and send notification
    if (totalPrice > 0) {
        const newBalance = user.funds - totalPrice;
        await setUserFunds(user.email, newBalance);
    }
    // Trigger notification flow (don't wait for it to complete)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ai$2f$flows$2f$data$3a$d2ee56__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["sendNewOrderNotification"])({
        orderId: createdOrder.id,
        username: user.username,
        serviceType: service.type,
        platform: service.platform
    }).catch((e)=>console.error("Failed to send notification:", e));
    const resultOrder = {
        id: createdOrder.id,
        userEmail: createdOrder.user_email,
        username: createdOrder.username,
        serviceId: createdOrder.service_id,
        platform: createdOrder.platform,
        serviceType: createdOrder.service_type,
        quantity: createdOrder.quantity,
        price: createdOrder.price,
        status: createdOrder.status,
        link: createdOrder.url,
        createdAt: createdOrder.created_at,
        comments: Array.isArray(createdOrder.comments) ? createdOrder.comments : null
    };
    return {
        success: true,
        order: resultOrder
    };
};
const updateOrderStatus = async (orderId, status)=>{
    const { data: order, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('orders').select('*').eq('id', orderId).single();
    if (fetchError || !order) {
        console.error("Error fetching order to update status:", fetchError);
        return null;
    }
    if (order.status !== 'Pending') return null;
    if (status === 'Cancelled' && order.price > 0) {
        const user = await getUser(order.user_email);
        if (user) {
            const newBalance = user.funds + order.price;
            await setUserFunds(user.email, newBalance);
        }
    }
    const { data: updatedOrder, error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('orders').update({
        status
    }).eq('id', orderId).select().single();
    if (updateError) {
        console.error("Error updating order status:", updateError);
        if (status === 'Cancelled' && order.price > 0) {
            const user = await getUser(order.user_email);
            if (user) {
                await setUserFunds(user.email, user.funds - order.price);
            }
        }
        return null;
    }
    const resultOrder = {
        id: updatedOrder.id,
        userEmail: updatedOrder.user_email,
        username: updatedOrder.username,
        serviceId: updatedOrder.service_id,
        platform: updatedOrder.platform,
        serviceType: updatedOrder.service_type,
        quantity: updatedOrder.quantity,
        price: updatedOrder.price,
        status: updatedOrder.status,
        link: updatedOrder.url,
        createdAt: updatedOrder.created_at,
        comments: Array.isArray(updatedOrder.comments) ? updatedOrder.comments : null
    };
    return resultOrder;
};
const getUsers = async ()=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('users').select('*');
    if (error) return [];
    return data || [];
};
const getPrices = ()=>({
        instagram: {
            followers: 0,
            likes: 0
        },
        tiktok: {
            followers: 0,
            likes: 0
        },
        youtube: {
            followers: 0,
            likes: 0
        }
    });
const updatePrices = (newPrices)=>{};
const setSession = (email)=>{};
const getSession = ()=>null;
const clearSession = ()=>{};
;
}}),
"[project]/src/lib/data.ts [app-ssr] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/data.ts [app-ssr] (ecmascript) <locals>");
}}),
"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/process [external] (process, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/os [external] (os, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[externals]/http2 [external] (http2, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}}),
"[externals]/dns [external] (dns, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}}),
"[project]/src/lib/firebase.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// Import the functions you need from the SDKs you need
__turbopack_context__.s({
    "app": (()=>app),
    "db": (()=>db),
    "messaging": (()=>messaging)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/index.mjs [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm2017.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$messaging$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/messaging/dist/index.mjs [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
;
;
;
// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase
let app;
let db;
let messaging = null;
if (firebaseConfig.projectId) {
    app = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getApps"])().length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["initializeApp"])(firebaseConfig) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getApp"])();
    db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirestore"])(app);
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
} else {
    console.warn("Firebase config is missing projectId. Firebase will not be initialized.");
    // Provide dummy objects to prevent app crash if Firebase is not configured
    app = {};
    db = {};
}
;
}}),
"[project]/src/lib/notifications.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "onMessageListener": (()=>onMessageListener),
    "requestNotificationPermission": (()=>requestNotificationPermission),
    "saveTokenToDb": (()=>saveTokenToDb)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$messaging$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/messaging/dist/index.mjs [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$messaging$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/messaging/dist/esm/index.esm2017.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
// IMPORTANT: You must get your VAPID key from your Firebase project settings
// and add it to your Vercel environment variables as NEXT_PUBLIC_FIREBASE_VAPID_KEY
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
const requestNotificationPermission = async ()=>{
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["messaging"]) {
        console.log("Firebase Messaging is not initialized.");
        return null;
    }
    if (!VAPID_KEY) {
        console.error("VAPID key is missing. Please set NEXT_PUBLIC_FIREBASE_VAPID_KEY in your environment variables.");
        return null;
    }
    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("Notification permission granted.");
            const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$messaging$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getToken"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["messaging"], {
                vapidKey: VAPID_KEY
            });
            return token;
        } else {
            console.log("Unable to get permission to notify.");
            return null;
        }
    } catch (error) {
        console.error("An error occurred while requesting permission or getting token:", error);
        return null;
    }
};
const saveTokenToDb = async (userId, token)=>{
    if (!userId || !token) return;
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('users').update({
        fcm_token: token
    }).eq('id', userId);
    if (error) {
        console.error("Error saving FCM token to DB:", error);
    } else {
        console.log("FCM Token saved to DB successfully for user:", userId);
    }
};
const onMessageListener = ()=>new Promise((resolve)=>{
        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["messaging"]) {
        // This part is commented out to keep it simple.
        // You can add logic here to show an in-app notification.
        // onMessage(messaging, (payload) => {
        //   console.log('Received foreground message: ', payload);
        //   resolve(payload);
        // });
        }
    });
}}),
"[project]/src/context/AuthContext.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "AuthProvider": (()=>AuthProvider),
    "useAuth": (()=>useAuth)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/lib/data.ts [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/data.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/notifications.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const setupNotifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (userId)=>{
        const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["requestNotificationPermission"])();
        if (token && userId) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveTokenToDb"])(userId, token);
        }
    }, []);
    const fetchUserByEmail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (email)=>{
        try {
            const profile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getUser"])(email);
            setUser(profile);
            if (profile) {
                // If the user is the admin, set up notifications
                if (profile.email === 'admin@gmail.com') {
                    await setupNotifications(profile.id);
                }
            }
        } catch (e) {
            console.error("Error fetching user profile", e);
            setUser(null);
        }
    }, [
        setupNotifications
    ]);
    const refreshUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (user?.email) {
            setIsLoading(true);
            try {
                await fetchUserByEmail(user.email);
            } catch (e) {
                console.error("Error refreshing user:", e);
            } finally{
                setIsLoading(false);
            }
        }
    }, [
        user,
        fetchUserByEmail
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleAuthStateChange = async (event, session)=>{
            try {
                if (session?.user?.email) {
                    await fetchUserByEmail(session.user.email);
                } else {
                    setUser(null);
                }
            } catch (e) {
                console.error("Auth state change error:", e);
            } finally{
                setIsLoading(false);
            }
        };
        // Check initial session
        const checkInitialSession = async ()=>{
            setIsLoading(true);
            try {
                const { data: { session }, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                if (error && error.message !== 'Invalid Refresh Token: Refresh Token Not Found') {
                    console.error("Error getting session:", error);
                }
                await handleAuthStateChange('INITIAL_SESSION', session);
            } catch (e) {
                console.error("Failed to check initial session:", e);
                setUser(null);
            } finally{
                setIsLoading(false);
            }
        };
        checkInitialSession();
        const { data: authListener } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange(async (event, session)=>{
            if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
                setIsLoading(true);
                await handleAuthStateChange(event, session);
            }
        });
        return ()=>{
            authListener.subscription.unsubscribe();
        };
    }, [
        fetchUserByEmail
    ]);
    const login = async ({ email, password })=>{
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithPassword({
                email,
                password
            });
            if (error) {
                return {
                    success: false,
                    error: error.message
                };
            }
            return {
                success: true
            };
        } catch (error) {
            console.error("Login failed:", error);
            return {
                success: false,
                error: "Failed to fetch. Please check your Supabase credentials in your environment variables."
            };
        }
    };
    const logout = async ()=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
    };
    const value = {
        user,
        login,
        logout,
        isLoading,
        refreshUser
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/AuthContext.tsx",
        lineNumber: 135,
        columnNumber: 10
    }, this);
}
const useAuth = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__af3ba377._.js.map