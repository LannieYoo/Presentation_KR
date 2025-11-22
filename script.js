// 네비게이션 메뉴 클릭 이벤트
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing navigation...');
    
    // 모든 페이지 숨기기 (초기화)
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => {
        page.style.display = 'none';
    });
    
    // 페이지 순서 정의
    const pageOrder = ['home', 'introduction', 'prolog-solutions', 'tips-practices', 'conclusion', 'references'];
    
    // 이전/다음 버튼 및 페이지 인디케이터 업데이트 함수
    function updateNavButtons(currentPageId) {
        const prevBtn = document.getElementById('nav-prev');
        const nextBtn = document.getElementById('nav-next');
        const pageIndicator = document.getElementById('page-indicator');
        
        if (!prevBtn || !nextBtn) return;
        
        const currentIndex = pageOrder.indexOf(currentPageId);
        const totalPages = pageOrder.length;
        
        // 페이지 인디케이터 업데이트
        if (pageIndicator) {
            const currentPageNum = currentIndex + 1;
            pageIndicator.textContent = `${currentPageNum} / ${totalPages}`;
        }
        
        // 이전 버튼 활성화/비활성화
        if (currentIndex > 0) {
            prevBtn.disabled = false;
            prevBtn.onclick = () => {
                const prevPageId = pageOrder[currentIndex - 1];
                const prevLink = document.querySelector(`.nav-link[href="#${prevPageId}"]`);
                if (prevLink) prevLink.click();
            };
        } else {
            prevBtn.disabled = true;
            prevBtn.onclick = null;
        }
        
        // 다음 버튼 활성화/비활성화
        if (currentIndex < pageOrder.length - 1) {
            nextBtn.disabled = false;
            nextBtn.onclick = () => {
                const nextPageId = pageOrder[currentIndex + 1];
                const nextLink = document.querySelector(`.nav-link[href="#${nextPageId}"]`);
                if (nextLink) nextLink.click();
            };
        } else {
            nextBtn.disabled = true;
            nextBtn.onclick = null;
        }
    }
    
    // 스크롤을 최상단으로 이동하는 함수
    function scrollToTop() {
        // 모든 가능한 스크롤 컨테이너를 최상단으로
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // main-container도 확인
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            mainContainer.scrollTop = 0;
        }
        
        // 모든 스크롤 가능한 요소 확인
        const scrollableElements = document.querySelectorAll('*');
        scrollableElements.forEach(el => {
            if (el.scrollTop > 0) {
                el.scrollTop = 0;
            }
        });
    }
    
    // 페이지 전환 함수
    function switchPage(pageId, clickedLink) {
        console.log('Switching to page:', pageId);
        
        // 먼저 스크롤을 즉시 최상단으로 이동
        scrollToTop();
        
        // 모든 페이지 숨기기
        allPages.forEach(page => {
            page.style.display = 'none';
            page.classList.remove('active');
        });
        
        // 선택된 페이지 표시
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.style.display = 'block';
            
            // 페이지 표시 직후 스크롤
            scrollToTop();
            
            // 다음 프레임에서 active 클래스 추가하여 페이드 인
            requestAnimationFrame(() => {
                targetPage.classList.add('active');
                scrollToTop();
            });
            
            // 여러 번 확인 (더 확실하게)
            setTimeout(() => scrollToTop(), 50);
            setTimeout(() => scrollToTop(), 100);
            setTimeout(() => scrollToTop(), 200);
            setTimeout(() => scrollToTop(), 300);
            
            console.log('Page shown:', pageId);
            
            // 이전/다음 버튼 업데이트
            updateNavButtons(pageId);
            
            // 모든 네비게이션 링크 비활성화
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(l => l.classList.remove('active'));
            
            // 해당 페이지의 네비게이션 링크 활성화
            const correspondingNavLink = document.querySelector(`.nav-link[href="#${pageId}"]`);
            if (correspondingNavLink) {
                correspondingNavLink.classList.add('active');
            }
        } else {
            console.error('Page not found:', pageId);
            return;
        }
    }
    
    // Home 페이지만 표시
    const homePage = document.getElementById('home');
    if (homePage) {
        homePage.style.display = 'block';
        homePage.classList.add('active');
        // 초기 이전/다음 버튼 상태 설정
        updateNavButtons('home');
    }
    
    // 네비게이션 링크에 이벤트 추가
    const navLinks = document.querySelectorAll('.nav-link');
    console.log('Found nav links:', navLinks.length);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 메뉴 클릭 즉시 최상단으로 스크롤 (함수 사용)
            scrollToTop();
            
            const href = this.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            
            const pageId = href.substring(1);
            switchPage(pageId, this);
        });
    });
    
    // 멤버 카드 링크에 이벤트 추가
    const teamCardLinks = document.querySelectorAll('.team-card-link');
    console.log('Found team card links:', teamCardLinks.length);
    
    teamCardLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const href = this.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            
            const pageId = href.substring(1);
            switchPage(pageId, this);
        });
    });
    
    // 키보드 네비게이션
    document.addEventListener('keydown', function(e) {
        const activePage = document.querySelector('.page[style*="display: block"]');
        if (!activePage) return;
        
        const pages = Array.from(allPages);
        const currentIndex = pages.indexOf(activePage);
        
        if (e.key === 'ArrowRight' && currentIndex < pages.length - 1) {
            const nextPage = pages[currentIndex + 1];
            const nextLink = document.querySelector(`.nav-link[href="#${nextPage.id}"]`);
            if (nextLink) nextLink.click();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            const prevPage = pages[currentIndex - 1];
            const prevLink = document.querySelector(`.nav-link[href="#${prevPage.id}"]`);
            if (prevLink) prevLink.click();
        }
    });
    
    // 스크롤 이벤트
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            navbar.style.boxShadow = window.pageYOffset > 0 
                ? '0 4px 20px rgba(0, 0, 0, 0.6)' 
                : '0 2px 10px rgba(0, 0, 0, 0.4)';
        });
    }
    
    console.log('Navigation initialized');
});
