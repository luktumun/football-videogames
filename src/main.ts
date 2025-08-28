if ((window as any).Cypress) {
  import('zone.js').then(() => {
    console.log('Zone.js loaded for Cypress');
    bootstrapApp();
  });
} else {
  bootstrapApp();
}

function bootstrapApp() {
  import('@angular/platform-browser').then(({ bootstrapApplication }) => {
    import('./app/app').then(({ App }) => {
      import('@angular/core').then(({ provideZoneChangeDetection }) => {
        import('@angular/common/http').then(({ provideHttpClient, withInterceptorsFromDi, withFetch }) => {
          import('@angular/router').then(({ provideRouter }) => {
            import('./app/app.routes').then(({ routes }) => {
              bootstrapApplication(App, {
                providers: [
                  provideZoneChangeDetection({ eventCoalescing: true }),
                  provideHttpClient(withInterceptorsFromDi(), withFetch()),
                  provideRouter(routes)
                ]
              });
            });
          });
        });
      });
    });
  });
}