// Supabase 클라이언트 설정
const SUPABASE_URL = 'https://vkruehwtypnlbhdurrcy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrcnVlaHd0eXBubGJoZHVycmN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzE3OTUsImV4cCI6MjA2NjAwNzc5NX0.0xtYEKfKkT0bRVflSCc2WjNOMHCh7lAyHLCxLPtCfgY';

// Supabase 클라이언트 초기화
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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