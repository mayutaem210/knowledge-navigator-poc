(function () {
  function nativeSearchInput() {
    return document.querySelector('.sidebar .search input');
  }

  function setNativeSearch(value) {
    var input = nativeSearchInput();
    if (!input) return false;
    var descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    if (descriptor && descriptor.set) descriptor.set.call(input, value || '');
    else input.value = value || '';
    ['input', 'change', 'keyup'].forEach(function (type) {
      input.dispatchEvent(new Event(type, { bubbles: true }));
    });
    return true;
  }

  function queryValue() {
    var hash = window.location.hash || '';
    var query = hash.split('?')[1] || '';
    return new URLSearchParams(query).get('q') || '';
  }

  function goToResults(value) {
    var keyword = (value || '').trim();
    if (!keyword) return;
    window.location.hash = '#/search-results?q=' + encodeURIComponent(keyword);
  }

  function bindSearchBox(inputId, buttonId) {
    var input = document.getElementById(inputId);
    var button = document.getElementById(buttonId);
    if (!input || !button) return;
    button.onclick = function () { goToResults(input.value); };
    input.onkeydown = function (event) {
      if (event.key === 'Enter') goToResults(input.value);
    };
  }

  function renderSearchResults() {
    var host = document.getElementById('kn-search-results');
    if (!host) return;

    var keyword = queryValue();
    var input = document.getElementById('kn-results-search');
    var summary = document.getElementById('kn-search-summary');
    if (input) input.value = keyword;

    if (!keyword) {
      if (summary) summary.textContent = '请输入搜索词 Enter a search term';
      host.innerHTML = '<div class="kn-search-empty">从问题、流程、系统或岗位名称开始搜索。</div>';
      return;
    }

    if (summary) summary.textContent = '正在搜索“' + keyword + '” Searching for “' + keyword + '”';
    host.innerHTML = '<div class="kn-search-loading">正在检索相关内容…</div>';
    if (!setNativeSearch(keyword)) {
      host.innerHTML = '<div class="kn-search-empty">搜索组件尚未就绪，请刷新页面后重试。</div>';
      return;
    }

    var attempts = 0;
    var timer = window.setInterval(function () {
      attempts += 1;
      var panel = document.querySelector('.sidebar .search .results-panel');
      var posts = panel ? panel.querySelectorAll('.matching-post') : [];
      var noData = panel && panel.textContent.trim() && !posts.length;

      if (posts.length || noData || attempts > 30) {
        window.clearInterval(timer);
        host.innerHTML = '';

        if (posts.length) {
          Array.prototype.forEach.call(posts, function (post) {
            var clone = post.cloneNode(true);
            clone.classList.add('kn-search-result-card');
            host.appendChild(clone);
          });
          if (summary) summary.textContent = '“' + keyword + '”的相关内容 Related content for “' + keyword + '”';
        } else {
          host.innerHTML = '<div class="kn-search-empty"><strong>未找到匹配内容 No matching content</strong><span>请尝试更短的关键词、同义词，或从首页导航进入。</span><a href="#/">返回首页 Back to Home →</a></div>';
          if (summary) summary.textContent = '未找到“' + keyword + '”的匹配内容';
        }
      }
    }, 100);
  }

  function setupSidebarGroups() {
    var links = document.querySelectorAll('.sidebar-nav > ul > li > ul > li > a');
    Array.prototype.forEach.call(links, function (link) {
      var item = link.parentElement;
      var submenu = item ? item.querySelector(':scope > ul') : null;
      if (!submenu || item.dataset.knCollapsible === 'true') return;

      item.dataset.knCollapsible = 'true';
      item.classList.add('kn-nav-group');
      link.setAttribute('aria-expanded', 'false');

      var currentPath = (window.location.hash || '').replace(/^#\/?/, '');
      var childLinks = submenu.querySelectorAll('a');
      var inCurrentGroup = Array.prototype.some.call(childLinks, function (child) {
        var href = (child.getAttribute('href') || '').replace(/^#\/?/, '').replace(/^\//, '');
        return href && currentPath.indexOf(href) === 0;
      });
      if (inCurrentGroup || item.classList.contains('active')) {
        item.classList.add('kn-open');
        link.setAttribute('aria-expanded', 'true');
      }

      link.addEventListener('click', function (event) {
        if (event.target !== link && event.target.closest('a') !== link) return;
        var isOpen = item.classList.contains('kn-open');
        if (!isOpen) {
          event.preventDefault();
          document.querySelectorAll('.sidebar-nav .kn-nav-group.kn-open').forEach(function (openItem) {
            if (openItem !== item) {
              openItem.classList.remove('kn-open');
              var openLink = openItem.querySelector(':scope > a');
              if (openLink) openLink.setAttribute('aria-expanded', 'false');
            }
          });
          item.classList.add('kn-open');
          link.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  function bindInteractions() {
    bindSearchBox('kn-home-search', 'kn-home-search-button');
    bindSearchBox('kn-results-search', 'kn-results-search-button');
    setupSidebarGroups();
    renderSearchResults();
  }

  document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      var input = document.getElementById('kn-home-search') || document.getElementById('kn-results-search') || nativeSearchInput();
      if (input) input.focus();
    }
  });

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook) {
    hook.doneEach(function () {
      document.body.classList.add('ready');
      window.setTimeout(bindInteractions, 0);
    });
  });
})();
