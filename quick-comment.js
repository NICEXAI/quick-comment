// ==UserScript==
// @name         快速评论，支持掘金、CSDN 和简书
// @namespace    https://github.com/NICEXAI
// @version      0.3
// @description  快速评论，支持掘金、CSDN 和简书。评论前请在 commentList 内填写你想要自动评论的内容。
// @author       afeyer
// @match        *://*.csdn.net/*
// @run-at document-end
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 如果希望自动过滤CSDN搜索列表内的下载内容请把当前项设置为 true
    const filterDownload = true
    // 请在此设置你想自动评论的内容，设置完毕后脚本会随机从评论列表内抽取一条自动回复
    const commentList = ["Leaflet 最新中文文档，可点击查看：https://leafletjs.cn", "Leaflet 中文文档更新了，详细内容可以查看：https://leafletjs.cn"];

    // 获取一个 button
    const getClickButton = function(fn) {
        let button = document.createElement("button"); //创建一个按钮
        button.textContent = "一键点赞评论"; //按钮内容
        button.style.width = "100px"; //按钮宽度
        button.style.height = "28px"; //按钮高度
        button.style.align = "center"; //文本居中
        button.style.color = "white"; //按钮文字颜色
        button.style.background = "#e33e33"; //按钮底色
        button.style.border = "1px solid #e33e33"; //边框属性
        button.style.borderRadius = "4px"; //按钮四个角弧度
        button.addEventListener("click", fn); //监听按钮点击事件
        return button;
    }

    // 过滤CSDN查询列表内的下载内容
    const filterCSDNArticle = function() {
        let csdnList = document.querySelectorAll(".list-container .list-item");
        let container = document.querySelector(".list-container .so-result-list");
        let downloadList = [];
        let articleList = [];
        let fragment = document.createDocumentFragment();

        if(csdnList.length) {
            for(let i = 0; i < csdnList.length; i ++) {
                let curDom = csdnList[i]

                if(!curDom.querySelector(".download-size")) {
                    articleList.push(curDom);
                } else {
                    downloadList.push(curDom);
                }
            }
        }

        if(articleList.length && downloadList.length) {
            for(let i = 0; i < articleList.length; i ++) {
                fragment.appendChild(articleList[i]);
            }

            container.innerHTML = ""
            container.appendChild(fragment)
            console.log("filter")
        }
    }


    const href = window.location.href
    //往CSDN详情页面注入操作
    if(href.match(RegExp(".*blog.csdn.net/.*/article/details/.*"))) {
        let button = getClickButton(function(){
            setTimeout(function(){
                let commentIndex = Math.floor(Math.random()* (commentList.length - 1)) ;//从 comment 随机读取一条内容进行回复
                document.getElementsByClassName("tool-item-comment")[0].click(); //打开评论区
                document.getElementById("comment_content").value = commentList[commentIndex]; //随机把一条预先写好的评论赋值到评论框里面
                document.getElementsByClassName("btn-comment")[0].click(); //发表评论
            },100);// setTimeout 0.1秒后执行
        })

        let like_comment = document.getElementsByClassName('toolbox-list')[0]; //getElementsByClassName 返回的是数组，所以要用[] 下标
        like_comment.appendChild(button); //把按钮加入到 x 的子节点中
    }

    // 过滤CSDN查询页内的下载内容
    if(href.match(RegExp(".*so.csdn.net/so/search/*"))) {
        setTimeout(function(){
            let container = document.querySelector(".list-container .so-result-list");
            if(!container) return;

            let observer = new MutationObserver(function(){
                filterCSDNArticle();
            });
            observer.observe(container, {
                subtree: true,
                childList: true
            })

            filterCSDNArticle()
        }, 500)
    }

})();