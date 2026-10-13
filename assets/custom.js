(function () {
  function nativeSearchInput() {
    return document.querySelector('.sidebar .search input');
  }

  function runHomeSearch(value) {
    var nativeInput = nativeSearchInput();
    if (!nativeInput) return;
    nativeInput.value = value || '';
    nativeInput.dispatchEvent(new Event('input', { bubbles: true }));
    nativeInput.focus();
  }

  function bindHomeInteractions() {
    var homeInput = document.getElementById('kn-home-search');
    var homeButton = document.getElementById('kn-home-search-button');
    if (homeButton && homeInput) {
      homeButton.onclick = function () { runHomeSearch(homeInput.value.trim()); };
      homeInput.onkeydown = function (event) {
        if (event.key === 'Enter') runHomeSearch(homeInput.value.trim());
      };
    }

    document.querySelectorAll('[data-kn-search]').forEach(function (button) {
      button.onclick = function () {
        var value = button.getAttribute('data-kn-search') || '';
        if (homeInput) homeInput.value = value;
        runHomeSearch(value);
      };
    });
  }

  document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      var homeInput = document.getElementById('kn-home-search');
      (homeInput || nativeSearchInput())?.focus();
    }
  });

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook) {
    hook.doneEach(function () {
      document.body.classList.add('ready');
      bindHomeInteractions();
    });
  });
})();
