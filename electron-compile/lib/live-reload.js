'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableLiveReload = enableLiveReload;

var _fileChangeCache = require('./file-change-cache');

var _fileChangeCache2 = _interopRequireDefault(_fileChangeCache);

var _pathwatcherRx = require('./pathwatcher-rx');

var _Observable = require('rxjs/Observable');

require('./custom-operators');

require('rxjs/add/observable/defer');

require('rxjs/add/observable/empty');

require('rxjs/add/observable/fromPromise');

require('rxjs/add/operator/catch');

require('rxjs/add/operator/filter');

require('rxjs/add/operator/mergeMap');

require('rxjs/add/operator/switchMap');

require('rxjs/add/operator/timeout');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function enableLiveReload() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let strategy = options.strategy;


  if (process.type !== 'browser' || !global.globalCompilerHost) throw new Error("Call this from the browser process, right after initializing electron-compile");

  switch (strategy) {
    case 'react-hmr':
      enableReactHMR();
      break;
    case 'naive':
    default:
      enableLiveReloadNaive();
  }
}

let BrowserWindow;
if (process.type === 'browser') {
  BrowserWindow = require('electron').BrowserWindow;
}

function reloadAllWindows() {
  let ret = BrowserWindow.getAllWindows().map(wnd => {
    if (!wnd.isVisible()) return Promise.resolve(true);

    return new Promise(res => {
      wnd.webContents.reloadIgnoringCache();
      wnd.once('ready-to-show', () => res(true));
    });
  });

  return Promise.all(ret);
}

function enableLiveReloadNaive() {
  let filesWeCareAbout = global.globalCompilerHost.listenToCompileEvents().filter(x => !_fileChangeCache2.default.isInNodeModules(x.filePath));

  let weShouldReload = filesWeCareAbout.mergeMap(x => (0, _pathwatcherRx.watchPath)(x.filePath).map(() => x)).guaranteedThrottle(1 * 1000);

  return weShouldReload.switchMap(() => _Observable.Observable.defer(() => _Observable.Observable.fromPromise(reloadAllWindows()).timeout(5 * 1000).catch(() => _Observable.Observable.empty()))).subscribe(() => console.log("Reloaded all windows!"));
}

function triggerHMRInRenderers() {
  BrowserWindow.getAllWindows().forEach(window => {
    window.webContents.send('__electron-compile__HMR');
  });

  return Promise.resolve(true);
}

function enableReactHMR() {
  global.__electron_compile_hmr_enabled__ = true;

  let filesWeCareAbout = global.globalCompilerHost.listenToCompileEvents().filter(x => !_fileChangeCache2.default.isInNodeModules(x.filePath));

  let weShouldReload = filesWeCareAbout.mergeMap(x => (0, _pathwatcherRx.watchPath)(x.filePath).map(() => x)).guaranteedThrottle(1 * 1000);

  return weShouldReload.switchMap(() => _Observable.Observable.defer(() => _Observable.Observable.fromPromise(triggerHMRInRenderers()).catch(() => _Observable.Observable.empty()))).subscribe(() => console.log("HMR sent to all windows!"));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9saXZlLXJlbG9hZC5qcyJdLCJuYW1lcyI6WyJlbmFibGVMaXZlUmVsb2FkIiwib3B0aW9ucyIsInN0cmF0ZWd5IiwicHJvY2VzcyIsInR5cGUiLCJnbG9iYWwiLCJnbG9iYWxDb21waWxlckhvc3QiLCJFcnJvciIsImVuYWJsZVJlYWN0SE1SIiwiZW5hYmxlTGl2ZVJlbG9hZE5haXZlIiwiQnJvd3NlcldpbmRvdyIsInJlcXVpcmUiLCJyZWxvYWRBbGxXaW5kb3dzIiwicmV0IiwiZ2V0QWxsV2luZG93cyIsIm1hcCIsInduZCIsImlzVmlzaWJsZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVzIiwid2ViQ29udGVudHMiLCJyZWxvYWRJZ25vcmluZ0NhY2hlIiwib25jZSIsImFsbCIsImZpbGVzV2VDYXJlQWJvdXQiLCJsaXN0ZW5Ub0NvbXBpbGVFdmVudHMiLCJmaWx0ZXIiLCJ4IiwiaXNJbk5vZGVNb2R1bGVzIiwiZmlsZVBhdGgiLCJ3ZVNob3VsZFJlbG9hZCIsIm1lcmdlTWFwIiwiZ3VhcmFudGVlZFRocm90dGxlIiwic3dpdGNoTWFwIiwiZGVmZXIiLCJmcm9tUHJvbWlzZSIsInRpbWVvdXQiLCJjYXRjaCIsImVtcHR5Iiwic3Vic2NyaWJlIiwiY29uc29sZSIsImxvZyIsInRyaWdnZXJITVJJblJlbmRlcmVycyIsImZvckVhY2giLCJ3aW5kb3ciLCJzZW5kIiwiX19lbGVjdHJvbl9jb21waWxlX2htcl9lbmFibGVkX18iXSwibWFwcGluZ3MiOiI7Ozs7O1FBZ0JnQkEsZ0IsR0FBQUEsZ0I7O0FBaEJoQjs7OztBQUNBOztBQUNBOztBQUVBOztBQUVBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRU8sU0FBU0EsZ0JBQVQsR0FBc0M7QUFBQSxNQUFaQyxPQUFZLHVFQUFKLEVBQUk7QUFBQSxNQUNyQ0MsUUFEcUMsR0FDeEJELE9BRHdCLENBQ3JDQyxRQURxQzs7O0FBRzNDLE1BQUlDLFFBQVFDLElB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aWxlIjoibGl2ZS1yZWxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRmlsZUNoYW5nZWRDYWNoZSBmcm9tICcuL2ZpbGUtY2hhbmdlLWNhY2hlJztcclxuaW1wb3J0IHt3YXRjaFBhdGh9IGZyb20gJy4vcGF0aHdhdGNoZXItcngnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcblxyXG5pbXBvcnQgJy4vY3VzdG9tLW9wZXJhdG9ycyc7XHJcblxyXG5pbXBvcnQgJ3J4anMvYWRkL29ic2VydmFibGUvZGVmZXInO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29ic2VydmFibGUvZW1wdHknO1xyXG5pbXBvcnQgJ3J4anMvYWRkL29ic2VydmFibGUvZnJvbVByb21pc2UnO1xyXG5cclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9jYXRjaCc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvZmlsdGVyJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9tZXJnZU1hcCc7XHJcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3Ivc3dpdGNoTWFwJztcclxuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci90aW1lb3V0JztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBlbmFibGVMaXZlUmVsb2FkKG9wdGlvbnM9e30pIHtcclxuICBsZXQgeyBzdHJhdGVneSB9ID0gb3B0aW9ucztcclxuXHJcbiAgaWYgKHByb2Nlc3MudHlwZSAhPT0gJ2Jyb3dzZXInIHx8ICFnbG9iYWwuZ2xvYmFsQ29tcGlsZXJIb3N0KSB0aHJvdyBuZXcgRXJyb3IoXCJDYWxsIHRoaXMgZnJvbSB0aGUgYnJvd3NlciBwcm9jZXNzLCByaWdodCBhZnRlciBpbml0aWFsaXppbmcgZWxlY3Ryb24tY29tcGlsZVwiKTtcclxuXHJcbiAgc3dpdGNoKHN0cmF0ZWd5KSB7XHJcbiAgY2FzZSAncmVhY3QtaG1yJzpcclxuICAgIGVuYWJsZVJlYWN0SE1SKCk7XHJcbiAgICBicmVhaztcclxuICBjYXNlICduYWl2ZSc6XHJcbiAgZGVmYXVsdDpcclxuICAgIGVuYWJsZUxpdmVSZWxvYWROYWl2ZSgpO1xyXG4gIH1cclxufVxyXG5cclxubGV0IEJyb3dzZXJXaW5kb3c7XHJcbmlmIChwcm9jZXNzLnR5cGUgPT09ICdicm93c2VyJykge1xyXG4gIEJyb3dzZXJXaW5kb3cgPSByZXF1aXJlKCdlbGVjdHJvbicpLkJyb3dzZXJXaW5kb3c7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbG9hZEFsbFdpbmRvd3MoKSB7XHJcbiAgbGV0IHJldCA9IEJyb3dzZXJXaW5kb3cuZ2V0QWxsV2luZG93cygpLm1hcCh3bmQgPT4ge1xyXG4gICAgaWYgKCF3bmQuaXNWaXNpYmxlKCkpIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMpID0+IHtcclxuICAgICAgd25kLndlYkNvbnRlbnRzLnJlbG9hZElnbm9yaW5nQ2FjaGUoKTtcclxuICAgICAgd25kLm9uY2UoJ3JlYWR5LXRvLXNob3cnLCAoKSA9PiByZXModHJ1ZSkpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBQcm9taXNlLmFsbChyZXQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBlbmFibGVMaXZlUmVsb2FkTmFpdmUoKSB7XHJcbiAgbGV0IGZpbGVzV2VDYXJlQWJvdXQgPSBnbG9iYWwuZ2xvYmFsQ29tcGlsZXJIb3N0Lmxpc3RlblRvQ29tcGlsZUV2ZW50cygpXHJcbiAgICAuZmlsdGVyKHggPT4gIUZpbGVDaGFuZ2VkQ2FjaGUuaXNJbk5vZGVNb2R1bGVzKHguZmlsZVBhdGgpKTtcclxuXHJcbiAgbGV0IHdlU2hvdWxkUmVsb2FkID0gZmlsZXNXZUNhcmVBYm91dFxyXG4gICAgLm1lcmdlTWFwKHggPT4gd2F0Y2hQYXRoKHguZmlsZVBhdGgpLm1hcCgoKSA9PiB4KSlcclxuICAgIC5ndWFyYW50ZWVkVGhyb3R0bGUoMSoxMDAwKTtcclxuXHJcbiAgcmV0dXJuIHdlU2hvdWxkUmVsb2FkXHJcbiAgICAuc3dpdGNoTWFwKCgpID0+IE9ic2VydmFibGUuZGVmZXIoKCkgPT4gT2JzZXJ2YWJsZS5mcm9tUHJvbWlzZShyZWxvYWRBbGxXaW5kb3dzKCkpLnRpbWVvdXQoNSoxMDAwKS5jYXRjaCgoKSA9PiBPYnNlcnZhYmxlLmVtcHR5KCkpKSlcclxuICAgIC5zdWJzY3JpYmUoKCkgPT4gY29uc29sZS5sb2coXCJSZWxvYWRlZCBhbGwgd2luZG93cyFcIikpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0cmlnZ2VySE1SSW5SZW5kZXJlcnMoKSB7XHJcbiAgQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkuZm9yRWFjaCgod2luZG93KSA9PiB7XHJcbiAgICB3aW5kb3cud2ViQ29udGVudHMuc2VuZCgnX19lbGVjdHJvbi1jb21waWxlX19ITVInKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZW5hYmxlUmVhY3RITVIoKSB7XHJcbiAgZ2xvYmFsLl9fZWxlY3Ryb25fY29tcGlsZV9obXJfZW5hYmxlZF9fID0gdHJ1ZTtcclxuXHJcbiAgbGV0IGZpbGVzV2VDYXJlQWJvdXQgPSBnbG9iYWwuZ2xvYmFsQ29tcGlsZXJIb3N0Lmxpc3RlblRvQ29tcGlsZUV2ZW50cygpXHJcbiAgICAuZmlsdGVyKHggPT4gIUZpbGVDaGFuZ2VkQ2FjaGUuaXNJbk5vZGVNb2R1bGVzKHguZmlsZVBhdGgpKTtcclxuXHJcbiAgbGV0IHdlU2hvdWxkUmVsb2FkID0gZmlsZXNXZUNhcmVBYm91dFxyXG4gICAgLm1lcmdlTWFwKHggPT4gd2F0Y2hQYXRoKHguZmlsZVBhdGgpLm1hcCgoKSA9PiB4KSlcclxuICAgIC5ndWFyYW50ZWVkVGhyb3R0bGUoMSoxMDAwKTtcclxuXHJcbiAgcmV0dXJuIHdlU2hvdWxkUmVsb2FkXHJcbiAgICAuc3dpdGNoTWFwKCgpID0+IE9ic2VydmFibGUuZGVmZXIoKCkgPT4gT2JzZXJ2YWJsZS5mcm9tUHJvbWlzZSh0cmlnZ2VySE1SSW5SZW5kZXJlcnMoKSkuY2F0Y2goKCkgPT4gT2JzZXJ2YWJsZS5lbXB0eSgpKSkpXHJcbiAgICAuc3Vic2NyaWJlKCgpID0+IGNvbnNvbGUubG9nKFwiSE1SIHNlbnQgdG8gYWxsIHdpbmRvd3MhXCIpKTtcclxufVxyXG4iXX0=