// 공통 네비게이션 바 컴포넌트
function createNavigation(currentPage = '', isLoggedIn = false) {
    return `
        <header class="relative flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-4 md:px-10 py-3 md:py-3">
            <!-- 모바일에서는 로고 숨김 -->
            <div class="hidden"></div>
            
            <!-- PC에서는 가운데 정렬된 컨테이너 -->
            <div class="hidden md:flex flex-1 items-center justify-center">
                <div class="flex items-center gap-24">
                    <!-- 로고 -->
                    <div class="flex items-center gap-2 text-[#111418]">
                        <div class="size-4 flex items-center justify-center">
                            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <h2 class="text-[#111418] text-lg font-bold leading-none tracking-[-0.015em] cursor-pointer flex items-center" onclick="window.location.href='index.html'">GaNaDa</h2>
                    </div>
                    
                    <!-- 메뉴 -->
                    <div class="flex items-center gap-9">
                        <a class="text-[#111418] text-sm font-medium leading-none flex items-center h-6 ${currentPage === 'home' ? 'font-bold' : ''}" href="index.html">Home</a>
                        <a class="text-[#111418] text-sm font-medium leading-none flex items-center h-6 ${currentPage === 'explore' ? 'font-bold' : ''}" href="explore.html">Explore</a>
                        <a class="text-[#111418] text-sm font-medium leading-none flex items-center h-6 ${currentPage === 'create' ? 'font-bold' : ''}" href="create-post.html">Create</a>

                        <button class="text-[#111418] text-sm font-medium leading-none flex items-center h-6 ${currentPage === 'notifications' ? 'font-bold' : ''} cursor-pointer" onclick="handleNotificationsClick()">Notifications</button>
                        ${isLoggedIn ? 
                            `<button class="text-[#111418] text-sm font-medium leading-none flex items-center h-6 cursor-pointer" onclick="handleLogout()">Logout</button>` :
                            `<a class="text-[#111418] text-sm font-medium leading-none flex items-center h-6 ${currentPage === 'login' ? 'font-bold' : ''}" href="login.html">Login</a>`
                        }
                    </div>
                </div>
            </div>
            <!-- 모바일에서 버튼들 (로고 없이 가운데 정렬) -->
            <div class="flex md:hidden items-center gap-4 flex-1 justify-center">
                <button
                    class="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 w-10 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em] ${currentPage === 'home' ? 'border-b-2 border-[#ff8c00]' : ''}"
                    onclick="window.location.href='index.html'"
                    title="Home"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
                    </svg>
                </button>
                <button
                    class="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 w-10 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em] ${currentPage === 'explore' ? 'border-b-2 border-[#ff8c00]' : ''}"
                    onclick="window.location.href='explore.html'"
                    title="Explore"
                >
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px">
                        <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
                    </svg>
                </button>
                <button
                    class="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 w-10 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em] ${currentPage === 'create' ? 'border-b-2 border-[#ff8c00]' : ''}"
                    onclick="window.location.href='create-post.html'"
                    title="Create"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                    </svg>
                </button>
                ${isLoggedIn ? 
                    `<button
                        class="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 w-10 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
                        onclick="handleLogout()"
                        title="Logout"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L196.69,120H104a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,221.66,122.34Z"></path>
                        </svg>
                    </button>` :
                    `<button
                        class="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 w-10 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em] ${currentPage === 'login' ? 'border-b-2 border-[#ff8c00]' : ''}"
                        onclick="window.location.href='login.html'"
                        title="Login"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M141.66,133.66l-40,40a8,8,0,0,1-11.32-11.32L116.69,136H24a8,8,0,0,1,0-16h92.69L90.34,93.66a8,8,0,0,1,11.32-11.32l40,40A8,8,0,0,1,141.66,133.66ZM192,32H136a8,8,0,0,0,0,16h56V208H136a8,8,0,0,0,0,16h56a16,16,0,0,0,16-16V48A16,16,0,0,0,192,32Z"></path>
                        </svg>
                    </button>`
                }

                <button
                    class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 md:h-10 bg-[#f0f2f4] text-[#111418] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 ${currentPage === 'notifications' ? 'border-b-2 border-[#ff8c00]' : ''}"
                    onclick="handleNotificationsClick()"
                    title="Notifications"
                >
                    <div class="text-[#111418]" data-icon="Bell" data-size="20px" data-weight="regular">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
                    </svg>
                </div>
                </button>
                ${currentPage !== 'login' && currentPage !== 'signup' ? `
                <button
                    class="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 w-10 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em] ${currentPage === 'profile' ? 'border-b-2 border-[#ff8c00]' : ''}"
                    onclick="window.location.href='profile.html'"
                    title="Profile"
                >
                    <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-6" style="background-image: url('https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face')"></div>
                </button>
                ` : ''}
            </div>
            
            <!-- PC에서 프로필 버튼만 오른쪽에 (절대 위치) -->
            ${currentPage !== 'login' && currentPage !== 'signup' ? `
            <div class="hidden md:block bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer absolute right-10" style="background-image: url('https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face')" onclick="window.location.href='profile.html'" title="Profile"></div>
            ` : ''}
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

// 알림 페이지 접근 시 로그인 체크
async function handleNotificationsClick() {
    try {
        let isLoggedIn = false;
        
        // Supabase 인증 상태 확인
        if (typeof supabase !== 'undefined') {
            const { data: { user } } = await supabase.auth.getUser();
            isLoggedIn = !!user;
        }
        
        if (!isLoggedIn) {
            alert('알림을 확인하려면 로그인이 필요합니다.');
            return;
        }
        
        // 로그인된 사용자는 알림 페이지로 이동
        window.location.href = 'notifications.html';
    } catch (error) {
        console.error('알림 페이지 접근 중 오류:', error);
        alert('알림을 확인하려면 로그인이 필요합니다.');
    }
}

// 로그아웃 처리 함수
async function handleLogout() {
    try {
        // Supabase 로그아웃
        if (typeof supabase !== 'undefined') {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('로그아웃 오류:', error);
                alert('로그아웃 중 오류가 발생했습니다.');
                return;
            }
        }
        
        // 로그인 페이지로 리다이렉트
        window.location.href = 'login.html';
    } catch (error) {
        console.error('로그아웃 처리 중 오류:', error);
        alert('로그아웃 중 오류가 발생했습니다.');
    }
}

// 네비게이션과 푸터를 페이지에 삽입하는 함수
function initNavigation(currentPage = '') {
    async function insertNavigation() {
        let isLoggedIn = false;
        
        // Supabase 인증 상태 확인
        try {
            if (typeof supabase !== 'undefined') {
                const { data: { user } } = await supabase.auth.getUser();
                isLoggedIn = !!user;
            }
        } catch (error) {
            console.error('인증 상태 확인 오류:', error);
        }
        
        const navContainer = document.getElementById('navigation-container');
        if (navContainer) {
            navContainer.innerHTML = createNavigation(currentPage, isLoggedIn);
        }
        
        // 푸터 삽입
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = createFooter();
        }
    }

    // Supabase가 로드될 때까지 대기
    async function waitForSupabaseAndInit() {
        let attempts = 0;
        const maxAttempts = 50; // 5초 대기
        
        while (attempts < maxAttempts) {
            if (typeof supabase !== 'undefined') {
                await insertNavigation();
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        // Supabase 로드 실패 시에도 기본 네비게이션 표시
        insertNavigation();
    }

    // DOM이 이미 로드되었으면 즉시 실행, 아니면 이벤트 리스너 등록
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForSupabaseAndInit);
    } else {
        waitForSupabaseAndInit();
    }
}

// 인증 상태 변화 감지 및 네비게이션 업데이트
function setupAuthStateListener(currentPage = '') {
    if (typeof supabase !== 'undefined') {
        supabase.auth.onAuthStateChange((event, session) => {
            const isLoggedIn = !!session;
            const navContainer = document.getElementById('navigation-container');
            if (navContainer) {
                navContainer.innerHTML = createNavigation(currentPage, isLoggedIn);
            }
        });
    }
} 