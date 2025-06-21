// 공통 네비게이션 바 컴포넌트
function createNavigation(currentPage = '') {
    return `
        <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-4 md:px-10 py-3 md:py-3">
            <div class="flex items-center gap-2 text-[#111418]">
                <div class="size-4 md:size-4">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
                    </svg>
                </div>
                <h2 class="text-[#111418] text-lg md:text-lg font-bold leading-tight tracking-[-0.015em] cursor-pointer" onclick="window.location.href='index.html'">GaNaDa</h2>
            </div>
            <div class="flex items-center gap-2 md:gap-4">
                <!-- 데스크톱 메뉴 -->
                <div class="hidden md:flex items-center gap-9">
                    <a class="text-[#111418] text-sm font-medium leading-normal ${currentPage === 'home' ? 'font-bold' : ''}" href="index.html">Home</a>
                    <a class="text-[#111418] text-sm font-medium leading-normal ${currentPage === 'explore' ? 'font-bold' : ''}" href="explore.html">Explore</a>
                    <a class="text-[#111418] text-sm font-medium leading-normal ${currentPage === 'create' ? 'font-bold' : ''}" href="create-post.html">Create</a>
                    <a class="text-[#111418] text-sm font-medium leading-normal ${currentPage === 'login' ? 'font-bold' : ''}" href="login.html">Login</a>
                </div>
                
                <!-- 모바일 메뉴 버튼들 -->
                <div class="flex md:hidden items-center gap-1">
                    <button
                        class="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 w-10 ${currentPage === 'home' ? 'bg-[#ff8c00] text-white' : 'bg-[#f0f2f4] text-[#111418]'} text-sm font-bold leading-normal tracking-[0.015em]"
                        onclick="window.location.href='index.html'"
                        title="Home"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
                        </svg>
                    </button>
                    <button
                        class="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 w-10 ${currentPage === 'explore' ? 'bg-[#ff8c00] text-white' : 'bg-[#f0f2f4] text-[#111418]'} text-sm font-bold leading-normal tracking-[0.015em]"
                        onclick="window.location.href='explore.html'"
                        title="Explore"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M128,16A112,112,0,1,0,240,128,112.13,112.13,0,0,0,128,16Zm0,208a96,96,0,1,1,96-96A96.11,96.11,0,0,1,128,224ZM173.66,90.34a8,8,0,0,1,11.31,11.32l-12,12a8,8,0,0,1-11.31-11.32Zm-67.32,67.32a8,8,0,0,1-11.31,11.32l-12-12a8,8,0,0,1,11.31-11.32ZM184,128a8,8,0,0,1-8,8H152a8,8,0,0,1,0-16h24A8,8,0,0,1,184,128ZM128,72a8,8,0,0,1,8-8V40a8,8,0,0,1-16,0V64A8,8,0,0,1,128,72Z"></path>
                        </svg>
                    </button>
                    <button
                        class="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 w-10 ${currentPage === 'create' ? 'bg-[#ff8c00] text-white' : 'bg-[#f0f2f4] text-[#111418]'} text-sm font-bold leading-normal tracking-[0.015em]"
                        onclick="window.location.href='create-post.html'"
                        title="Create"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                        </svg>
                    </button>
                    <button
                        class="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 w-10 ${currentPage === 'login' ? 'bg-[#ff8c00] text-white' : 'bg-[#f0f2f4] text-[#111418]'} text-sm font-bold leading-normal tracking-[0.015em]"
                        onclick="window.location.href='login.html'"
                        title="Login"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M141.66,133.66l-40,40a8,8,0,0,1-11.32-11.32L116.69,136H24a8,8,0,0,1,0-16h92.69L90.34,93.66a8,8,0,0,1,11.32-11.32l40,40A8,8,0,0,1,141.66,133.66ZM192,32H136a8,8,0,0,0,0,16h56V208H136a8,8,0,0,0,0,16h56a16,16,0,0,0,16-16V48A16,16,0,0,0,192,32Z"></path>
                        </svg>
                    </button>
                </div>

                <div class="flex items-center gap-2 md:gap-4">
                    <button
                        class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 md:h-10 bg-[#f0f2f4] text-[#111418] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
                        onclick="window.location.href='search.html'"
                        title="Search"
                    >
                        <div class="text-[#111418]" data-icon="MagnifyingGlass" data-size="20px" data-weight="regular">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                            </svg>
                        </div>
                    </button>
                    <button
                        class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 md:h-10 bg-[#f0f2f4] text-[#111418] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
                        onclick="window.location.href='notifications.html'"
                        title="Notifications"
                    >
                        <div class="text-[#111418]" data-icon="Bell" data-size="20px" data-weight="regular">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
                            </svg>
                        </div>
                    </button>
                </div>
                ${currentPage !== 'login' && currentPage !== 'signup' ? `
                <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 md:size-10 cursor-pointer" style="background-image: url('https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face')" onclick="window.location.href='profile.html'"></div>
                ` : ''}
            </div>
        </header>
    `;
}

// 공통 푸터 컴포넌트
function createFooter() {
    return `
        <footer class="border-t border-solid border-t-[#f0f2f4] px-4 md:px-10 py-2 md:py-3 mt-auto">
            <div class="flex flex-col items-center justify-center gap-0.5 md:gap-1">
                <div class="flex items-center gap-1 md:gap-2 text-[#6a7581]">
                    <div class="size-2.5 md:size-3">
                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
                        </svg>
                    </div>
                    <span class="text-xs md:text-sm font-medium">GaNaDa</span>
                </div>
                <p class="text-[#6a7581] text-xs text-center leading-none md:leading-tight">
                    © 2025 UJUSOL. All rights reserved.
                </p>
            </div>
        </footer>
    `;
}

// 네비게이션과 푸터를 페이지에 삽입하는 함수
function initNavigation(currentPage = '') {
    document.addEventListener('DOMContentLoaded', function() {
        const navContainer = document.getElementById('navigation-container');
        if (navContainer) {
            navContainer.innerHTML = createNavigation(currentPage);
        }
        
        // 푸터 삽입
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = createFooter();
        }
    });
} 