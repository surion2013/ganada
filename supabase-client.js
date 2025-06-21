// Supabase 클라이언트 설정
const SUPABASE_URL = 'https://vkruehwtypnlbhdurrcy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrcnVlaHd0eXBubGJoZHVycmN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzE3OTUsImV4cCI6MjA2NjAwNzc5NX0.0xtYEKfKkT0bRVflSCc2WjNOMHCh7lAyHLCxLPtCfgY';

// Supabase 클라이언트 초기화 (안전한 방식)
let supabase;

try {
  if (typeof window !== 'undefined' && window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase 클라이언트 초기화 완료');
  } else {
    console.error('Supabase 라이브러리가 로드되지 않았습니다.');
  }
} catch (error) {
  console.error('Supabase 클라이언트 초기화 오류:', error);
}

// 인증 관련 함수들
const Auth = {
  // 회원가입
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  },

  // 로그인
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  },

  // 로그아웃
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  },

  // 현재 사용자 가져오기
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { success: true, user };
    } catch (error) {
      console.error('Get user error:', error);
      return { success: false, error: error.message };
    }
  },

  // 인증 상태 변화 감지
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// 데이터베이스 관련 함수들
const Database = {
  // 사용자 프로필 생성/업데이트
  async upsertUserProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Upsert user profile error:', error);
      return { success: false, error: error.message };
    }
  },

  // 사용자 프로필 가져오기
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get user profile error:', error);
      return { success: false, error: error.message };
    }
  },

  // 포스트 생성
  async createPost(postData) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Create post error:', error);
      return { success: false, error: error.message };
    }
  },

  // 포스트 목록 가져오기
  async getPosts(limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users!posts_user_id_fkey (
            username,
            avatar_url
          ),
          likes!posts_likes_post_id_fkey (count),
          comments!posts_comments_post_id_fkey (count)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get posts error:', error);
      return { success: false, error: error.message };
    }
  },

  // 좋아요 토글
  async toggleLike(postId, userId) {
    try {
      // 기존 좋아요 확인
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingLike) {
        // 좋아요 제거
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);
        
        if (deleteError) throw deleteError;
        return { success: true, liked: false };
      } else {
        // 좋아요 추가
        const { error: insertError } = await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: userId });
        
        if (insertError) throw insertError;

        // 포스트 작성자에게 좋아요 알림 생성 (자신의 포스트가 아닌 경우에만)
        const { data: post } = await supabase
          .from('posts')
          .select('user_id')
          .eq('id', postId)
          .single();
        
        if (post && post.user_id !== userId) {
          await this.createNotification(post.user_id, 'like', null, userId, postId);
        }
        
        return { success: true, liked: true };
      }
    } catch (error) {
      console.error('Toggle like error:', error);
      return { success: false, error: error.message };
    }
  },

  // 댓글 추가
  async addComment(postId, userId, content) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: userId,
          content
        })
        .select(`
          *,
          users!comments_user_id_fkey (
            username,
            avatar_url
          )
        `);
      
      if (error) throw error;

      // 포스트 작성자에게 댓글 알림 생성 (자신의 포스트가 아닌 경우에만)
      const { data: post } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();
      
      if (post && post.user_id !== userId) {
        await this.createNotification(post.user_id, 'comment', content, userId, postId);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Add comment error:', error);
      return { success: false, error: error.message };
    }
  },

  // 포스트의 댓글 가져오기
  async getComments(postId) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          users!comments_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get comments error:', error);
      return { success: false, error: error.message };
    }
  },

  // 팔로우 토글
  async toggleFollow(followerId, followingId) {
    try {
      // 기존 팔로우 확인
      const { data: existingFollow, error: checkError } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingFollow) {
        // 언팔로우
        const { error: deleteError } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', followerId)
          .eq('following_id', followingId);
        
        if (deleteError) throw deleteError;
        return { success: true, following: false };
      } else {
        // 팔로우
        const { error: insertError } = await supabase
          .from('follows')
          .insert({ 
            follower_id: followerId, 
            following_id: followingId 
          });
        
        if (insertError) throw insertError;

        // 팔로우 알림 생성
        await this.createNotification(followingId, 'follow', null, followerId);
        
        return { success: true, following: true };
      }
    } catch (error) {
      console.error('Toggle follow error:', error);
      return { success: false, error: error.message };
    }
  },

  // 팔로우 상태 확인
  async checkFollowStatus(followerId, followingId) {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return { success: true, following: !!data };
    } catch (error) {
      console.error('Check follow status error:', error);
      return { success: false, error: error.message };
    }
  },

  // 팔로워 목록 가져오기
  async getFollowers(userId, limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          *,
          users!follows_follower_id_fkey (
            id,
            username,
            avatar_url,
            full_name
          )
        `)
        .eq('following_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get followers error:', error);
      return { success: false, error: error.message };
    }
  },

  // 팔로잉 목록 가져오기
  async getFollowing(userId, limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          *,
          users!follows_following_id_fkey (
            id,
            username,
            avatar_url,
            full_name
          )
        `)
        .eq('follower_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get following error:', error);
      return { success: false, error: error.message };
    }
  },

  // 알림 생성
  async createNotification(userId, type, content, relatedUserId = null, relatedPostId = null) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          content,
          related_user_id: relatedUserId,
          related_post_id: relatedPostId
        })
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Create notification error:', error);
      return { success: false, error: error.message };
    }
  },

  // 사용자 알림 가져오기
  async getNotifications(userId, limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          related_user:users!notifications_related_user_id_fkey (
            username,
            avatar_url
          ),
          related_post:posts!notifications_related_post_id_fkey (
            image_url,
            caption
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get notifications error:', error);
      return { success: false, error: error.message };
    }
  },

  // 알림 읽음 처리
  async markNotificationAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Mark notification as read error:', error);
      return { success: false, error: error.message };
    }
  },

  // 모든 알림 읽음 처리
  async markAllNotificationsAsRead(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      return { success: false, error: error.message };
    }
  },

  // 읽지 않은 알림 수 가져오기
  async getUnreadNotificationCount(userId) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);
      
      if (error) throw error;
      return { success: true, count };
    } catch (error) {
      console.error('Get unread notification count error:', error);
      return { success: false, error: error.message };
    }
  }
};

// 스토리지 관련 함수들
const Storage = {
  // 이미지 업로드
  async uploadImage(file, bucket = 'posts') {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) throw error;

      // 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return { success: true, url: publicUrl, path: filePath };
    } catch (error) {
      console.error('Upload image error:', error);
      return { success: false, error: error.message };
    }
  },

  // 이미지 삭제
  async deleteImage(filePath, bucket = 'posts') {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Delete image error:', error);
      return { success: false, error: error.message };
    }
  }
};

// 전역에서 사용할 수 있도록 내보내기
window.SupabaseClient = {
  supabase,
  Auth,
  Database,
  Storage
}; 