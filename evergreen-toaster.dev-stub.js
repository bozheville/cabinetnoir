// Dev-only stub for evergreen-ui/esm/toaster.
// The real module runs `new Toaster()` at import time, which calls
// ReactDOM.render - removed in React 19. In dev mode webpack keeps the
// whole evergreen barrel, so the singleton evaluates and crashes every
// page that imports evergreen-ui. Production builds tree-shake the
// toaster away (see commit 1a767d4), so this stub is only aliased in dev.
const noop = () => undefined;

const toaster = {
  danger: noop,
  warning: noop,
  success: noop,
  notify: noop,
  closeAll: noop,
  getToasts: () => [],
};

module.exports = toaster;
module.exports.toaster = toaster;
module.exports.default = toaster;
