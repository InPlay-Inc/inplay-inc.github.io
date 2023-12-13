'use strict';

{{ $searchDataFile := printf "%s.search-data.json" .Language.Lang }}
{{ $searchData := resources.Get "search-data.json" | resources.ExecuteAsTemplate $searchDataFile . | resources.Minify | resources.Fingerprint }}
{{ $searchConfig := i18n "bookSearchConfig" | default "{}" }}

(function () {
  const searchDataURL = '{{ $searchData.RelPermalink }}';
  const indexConfig = Object.assign({{ $searchConfig }}, {
    doc: {
      id: 'id',
      field: ['title', 'content'],
      store: ['title', 'href', 'content','section']
    }
  });

  var resulstContent = param("f");
  var resulstIndex = parseInt(param("i"));
  if(resulstContent){
    searchContent(resulstContent,resulstIndex);
  }

  const input = document.querySelector('#book-search-input');
  const results = document.querySelector('#book-search-results');

  if (!input) {
    return
  }

  input.addEventListener('focus', init);
  input.addEventListener('keyup', search);

  document.addEventListener('keypress', focusSearchFieldOnKeyPress);

  //自动定位查找结果
  function searchContent(keyword, index) {
    if (window.find && window.getSelection) {
      var findIndex = 0;//标记当前界面查到的keyword，用于定位至指定位置的keyword
      document.designMode = "on";
      var sel = window.getSelection();
      sel.collapse(document.body, 0);
      let elements = document.getElementsByClassName("markdown")[0].children;//只查询markdown类元素下的内容
       for (var i = 0; i < elements.length; i++) {
        let element = elements[i];
        const regex = new RegExp(keyword, "gi");//全局搜索，不区分大小写
        let matches = element.textContent.toLowerCase().match(regex);
        if(matches!== null){
          if(index <= findIndex){//指定位置下才进入，否则跳过
            element.scrollIntoView({behavior: 'smooth', block: 'center'});//页面滑动至指定元素
            var mark = new Mark(element);//标记当前元素的keyword
            mark.mark(keyword);
            break;
          }
          findIndex += matches.length;//跳过时，findIndex加上已匹配到内容的大小
        }
      }
      document.designMode = "off";
    }
  }


  /**
   * @param {Event} event
   */
  function focusSearchFieldOnKeyPress(event) {
    if (event.target.value !== undefined) {
      return;
    }

    if (input === document.activeElement) {
      return;
    }

    const characterPressed = String.fromCharCode(event.charCode);
    if (!isHotkey(characterPressed)) {
      return;
    }

    input.focus();
    event.preventDefault();
  }

  /**
   * @param {String} character
   * @returns {Boolean} 
   */
  function isHotkey(character) {
    const dataHotkeys = input.getAttribute('data-hotkeys') || '';
    return dataHotkeys.indexOf(character) >= 0;
  }

  function init() {
    input.removeEventListener('focus', init); // init once
    input.required = true;

    fetch(searchDataURL)
      .then(pages => pages.json())
      .then(pages => {
        window.bookSearchIndex = FlexSearch.create('balance', indexConfig);
        window.bookSearchIndex.add(pages);
      })
      .then(() => input.required = false)
      .then(search);
  }

  function search() {
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }

    if (!input.value) {
      return;
    }

    const searchHits = window.bookSearchIndex.search(input.value, 10);
    searchHits.forEach(function (page) {
      var content = page.content;
      //match string
      var regex = new RegExp(input.value, "gi");
      var result = [];
      var match;
      var searchIndex = 0;
      while (match = regex.exec(content)) {//匹配全文内容所有keyword
        var index = match.index
        result.push(index);
        var startIndex, endIndex;
        var tempResult = "";
        var findResult = "";
        if (index <= 10) {//显示前后共50字符，查找目标前不足10字符时全数显示
          startIndex = 0;
          endIndex = index + 30;
        } else {
          tempResult += "..."
          startIndex = index - 10;
          endIndex = index + 40;
        }
        if(endIndex <= content.length){
          findResult = content.substring(startIndex,endIndex )
          tempResult += findResult + "..." ;
        }else{
          findResult = content.substring(startIndex,content.length-1);
          tempResult += findResult;
        }
        
        const li = element('<li><a href></a><small></small></li>');
        const a = li.querySelector('a'), small = li.querySelector('small');
  
        a.href = page.href + "?f="+input.value+"&i="+ searchIndex;
        a.textContent = tempResult;
        small.textContent = page.section + "·" + page.title;
  
        results.appendChild(li);
        var mark = new Mark(li);//高亮Keyword
        mark.mark(input.value);
        searchIndex++;
      }
      
    });
  }

  /**
   * @param {String} content
   * @returns {Node}
   */
  function element(content) {
    const div = document.createElement('div');
    div.innerHTML = content;
    return div.firstChild;
  }
})();
