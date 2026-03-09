// ==UserScript==
// @name 			Better Soundcloud Design
// @namespace 		https://github.com/anytngv2/soundcloud-script
// @supportURL 		https://github.com/anytngv2/soundcloud-script
// @version 		1.2.1
// @description 	Improves Soundcloud's design by enhancing the default styles
// @author 			AnytngV2
// @match           https://soundcloud.com/*
// @icon 			https://static.zerochan.net/favicon.png
// @license 		MIT
// @compatible 		chrome
// @compatible 		edge
// @compatible 		firefox
// @compatible 		waterfox
// @compatible 		librewolf
// @compatible 		safari
// @compatible 		brave
// @grant 			none
// @run-at 			document-end
// @updateURL 		
// @downloadURL 	
// @require         file://E:\anytngv2\soundcloud-script\script.js
// ==/UserScript==

(function () {
    'use strict';

    const VERSION = "1.0.0";
    console.log("ANTG2 - Soundcloud script loaded");

    // =================
    // Gradient Management
    // =================

    function getGradientSource() {
        const active = document.querySelector('.backgroundGradient__buffer:not(.backgroundGradient__hidden)');
        const any = document.querySelector('.backgroundGradient__buffer');

        if (active?.style?.background) return { el: active, type: 'active' };
        if (any?.style?.background) return { el: any, type: 'any' };
        return null;
    }

    function applyGradient() {
        const app = document.querySelector('body');
        const bg = document.querySelector('.backgroundGradient');

        if (!app) return;

        const source = getGradientSource();

        if (source && !document.querySelector(".profileHeader")) {
            app.style.background = source.el.style.background;
            localStorage.setItem('soundcloud-gradient', source.el.style.background);
            // remove antg2__gradientCircle
            if (document.querySelector('.antg2__gradientCircle')) {
                document.querySelector('.antg2__gradientCircle').remove();
                document.querySelector('.antg2__gradientCircle2').remove();
            }
        }



        if (bg) bg.style.display = 'none';
    }

    function removeGradient() {
        const app = document.querySelector('body');
        if (app) app.style.background = '#121212';

        // add design
        if (!document.querySelector('.antg2__gradientCircle')) {

            const circleCSS = `
            .antg2__gradientCircle {
                position: absolute;
                top: 0;
                right: 0;
                width: 100dvw;
                height: 100dvh;
                background: radial-gradient(circle at top right, #ff770030 0%, transparent 45%);
                pointer-events: none;
                animation: antg2__circleAnimation 4s ease-in-out infinite;
            }

            .antg2__gradientCircle2 {
                position: absolute;
                bottom: 10px;
                left: 10px;
                width: 900px;
                height: 900px;
                background: radial-gradient(circle, #ff77000e 0%, transparent 60%);
                pointer-events: none;
                animation: antg2__circleAnimation2 4s ease-in-out infinite;
            }

            @keyframes antg2__circleAnimation {
                50% {
                    top: -60px;
                }
            }

            @keyframes antg2__circleAnimation2 {
                50% {
                    bottom: 60px;
                }
            }
            `;

            const circle = document.createElement('div');
            circle.className = 'antg2__gradientCircle';
            document.body.appendChild(circle);

            const circle2 = document.createElement('div');
            circle2.className = 'antg2__gradientCircle2';
            document.body.appendChild(circle2);

            const styleEl = document.createElement('style');
            styleEl.textContent = circleCSS;
            document.head.appendChild(styleEl);
        }

    }

    // =================
    // DOM Observers
    // =================

    const bufferObserver = new MutationObserver((mutations) => {
        const shouldUpdate = mutations.some(m =>
            m.type === 'attributes' &&
            m.attributeName === 'class' &&
            m.target.classList.contains('backgroundGradient__buffer')
        );

        if (shouldUpdate) setTimeout(applyGradient, 50);
    });

    function observeBuffers() {
        document.querySelectorAll('.backgroundGradient__buffer').forEach(buffer => {
            bufferObserver.observe(buffer, {
                attributes: true,
                attributeFilter: ['class'],
                attributeOldValue: true
            });
        });
    }

    const domObserver = new MutationObserver((mutations) => {
        const hasNewBuffers = mutations.some(m =>
            [...(m.addedNodes || [])].some(node =>
                node.nodeType === 1 &&
                (node.classList?.contains('backgroundGradient__buffer') ||
                    node.querySelector?.('.backgroundGradient__buffer'))
            )
        );

        if (hasNewBuffers) {
            observeBuffers();
            setTimeout(applyGradient, 100);
        }
    });

    domObserver.observe(document.body, { childList: true, subtree: true });

    // =================
    // Navigation Handling
    // =================

    let lastUrl = location.href;

    const urlObserver = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(() => {
                observeBuffers();
                setTimeout(applyGradient, 500);
            }, 500);
        }
    });

    const titleEl = document.querySelector('title');
    if (titleEl) {
        urlObserver.observe(titleEl, { subtree: true, characterData: true, childList: true });
    }

    // Intercept history changes
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        setTimeout(() => {
            observeBuffers();
            setTimeout(applyGradient, 500);
        }, 500);
    };

    window.addEventListener('popstate', () => {
        setTimeout(() => {
            observeBuffers();
            setTimeout(applyGradient, 500);
        }, 500);
    });

    // Fallback interval
    setInterval(() => {
        const app = document.querySelector('body');
        if (!app) return;

        const source = getGradientSource();

        if (source && app.style.background !== source.el.style.background) {
            applyGradient();
        } else if (!source) {
            removeGradient();
        }
    }, 1000);

    // =================
    // Styles Injection
    // =================

    const styles = `
        .playControls, header.header {
            background: #121212ac;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: none;
        }

        .fullHero__titleTextLineBig,
        .fullHero__titleTextLineSmall a {
            background: #121212ac !important;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 5px;
            border: 1px solid #121212cb;
            margin: 0 0 15px 0;
        }

        .systemPlaylistHero__titleButton a {
            background: #121212ac !important;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid #121212cb;
            margin: 0 0 15px 0;
        }

        .header__upsellWrapper.left,
        .sidebarModule,
        .mobileApps { display: none; }

        // .sc-button.sc-button-follow,
        // .sc-button.sc-button-like.sc-button-selected{
        //     background: #ff77005e !important;
        //     border-radius: 5px !important;
        //     border: 1px solid #ff7700 !important;
        //     color: #ffffff !important;
        // }

        .sc-button:is(.sc-button-like, .sc-button-share, .sc-button-repost, .sc-button-more, .sc-button-queue, .sc-button-copylink, .sc-button-follow){
            background: #1212125e !important;
            border-radius: 5px !important;
            border: 1px solid #121212 !important;
            color: #ffffff !important;
        }

        .sc-button:is(.sc-button-like, .sc-button-share, .sc-button-repost, .sc-button-more, .sc-button-queue, .sc-button-copylink, .sc-button-follow).sc-button-selected{
            background: #ff77005e !important;
            border-radius: 5px !important;
            border: 1px solid #ff7700 !important;
            color: #ffffff !important;
        }

        .fullHero__foreground{
            padding: 30px 0;
        }

        .image.image__lightOutline.sc-artwork-40x{
            background: linear-gradient(45deg, #a74e00, #ff7700) !important;
            padding:5px;
        }

        .fullHero__artwork.systemPlaylistHero__artwork{
            right:0;
        }

        .trackItem{
            padding:0;
        }

        .systemPlaylistTrackList__item{
            padding: 0 0 0 10px;
            border-left: 0px solid transparent;
            border-radius:5px;
        }

        .systemPlaylistTrackList__item:hover{
            background: #1212125e !important;
            padding: 0 5px 0 10px;
            transition:.3s;
            border-left: 5px solid #ff7700;
            border-radius:5px;
        }

        .systemPlaylistTrackList__item .trackItem{
            background: unset;
            padding 0 5px;
        }

        .sidebarModule__webiEmbeddedModule{
            display:none;
        }

        .soundBadge__additional,.soundBadge__actions{
            background: linear-gradient(270deg, #ff7700 79.69%, transparent, 0)) !important;
        }

        .profileHeader{
            position: absolute !important;
            width: calc(100dvw - 18px) !important;
            margin: 20px 0;
            border-radius: 5px;
            left: 0;
            top: 0;
            padding:0 !important;
            height: 300px !important;
        }

        .profileHeader__info{
            padding:0 30px;
        }

        .profileHeaderBackground__visual{
            background-size:cover !important;
        }

        .profileHeaderInfo__userName{
            background: #121212ac !important;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 5px;
            margin: 0 0 15px 0;
        }

        .profileHeaderInfo__additional{
            background: #121212ac !important;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 5px;
            margin: 0 0 15px 0;
            font-size:12px;
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // =================
    // UI Components
    // =================

    const sidebar = document.querySelector(".l-sidebar-right");
    if (sidebar) {
        const info = document.createElement("div");
        info.className = "antg2__scriptInfo";
        info.innerHTML = `
            <p>SoundCloud Script v${VERSION}</p>
            <a href="https://github.com/anytngv2/soundcloud-script" target="_blank">Github</a>
        `;
        sidebar.appendChild(info);
    }

    // Init
    observeBuffers();
    setTimeout(applyGradient, 1000);

    // =================
    // Profile Header Detection
    // =================

    const profileObserver = new MutationObserver(() => {
        const hasProfile = document.querySelector('.profileHeader');
        const existingStyle = document.getElementById('antg2__profileHeader');

        if (hasProfile && !existingStyle) {
            const style = document.createElement('style');
            style.id = 'antg2__profileHeader';
            style.textContent = '#content{margin:300px 0 0 0 !important;}';
            document.head.appendChild(style);
        } else if (!hasProfile && existingStyle) {
            existingStyle.remove();
        }
    });

    profileObserver.observe(document.body, { childList: true, subtree: true });
})();