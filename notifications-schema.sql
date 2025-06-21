-- 알림 테이블 생성
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'post')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- RLS (Row Level Security) 정책 활성화
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 알림만 볼 수 있음
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = recipient_id);

-- 시스템에서 알림 생성 가능 (인증된 사용자)
CREATE POLICY "Authenticated users can create notifications" ON notifications
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 사용자는 자신의 알림만 업데이트 가능 (읽음 처리 등)
CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = recipient_id);

-- 사용자는 자신의 알림만 삭제 가능
CREATE POLICY "Users can delete their own notifications" ON notifications
    FOR DELETE USING (auth.uid() = recipient_id);

-- 알림 자동 생성을 위한 함수들

-- 좋아요 알림 생성 함수
CREATE OR REPLACE FUNCTION create_like_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- 자신의 포스트에 자신이 좋아요 누른 경우는 알림 생성하지 않음
    IF NEW.user_id != (SELECT user_id FROM posts WHERE id = NEW.post_id) THEN
        INSERT INTO notifications (
            recipient_id,
            sender_id,
            type,
            title,
            message,
            related_post_id
        )
        SELECT 
            posts.user_id,
            NEW.user_id,
            'like',
            '새로운 좋아요',
            users.username || '님이 회원님의 게시물을 좋아합니다.',
            NEW.post_id
        FROM posts
        JOIN users ON users.id = NEW.user_id
        WHERE posts.id = NEW.post_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 댓글 알림 생성 함수
CREATE OR REPLACE FUNCTION create_comment_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- 자신의 포스트에 자신이 댓글 단 경우는 알림 생성하지 않음
    IF NEW.user_id != (SELECT user_id FROM posts WHERE id = NEW.post_id) THEN
        INSERT INTO notifications (
            recipient_id,
            sender_id,
            type,
            title,
            message,
            related_post_id
        )
        SELECT 
            posts.user_id,
            NEW.user_id,
            'comment',
            '새로운 댓글',
            users.username || '님이 회원님의 게시물에 댓글을 남겼습니다: "' || LEFT(NEW.content, 50) || '"',
            NEW.post_id
        FROM posts
        JOIN users ON users.id = NEW.user_id
        WHERE posts.id = NEW.post_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 팔로우 알림 생성 함수
CREATE OR REPLACE FUNCTION create_follow_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (
        recipient_id,
        sender_id,
        type,
        title,
        message
    )
    SELECT 
        NEW.following_id,
        NEW.follower_id,
        'follow',
        '새로운 팔로워',
        users.username || '님이 회원님을 팔로우하기 시작했습니다.'
    FROM users
    WHERE users.id = NEW.follower_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성

-- 좋아요 시 알림 생성
DROP TRIGGER IF EXISTS trigger_like_notification ON likes;
CREATE TRIGGER trigger_like_notification
    AFTER INSERT ON likes
    FOR EACH ROW
    EXECUTE FUNCTION create_like_notification();

-- 댓글 시 알림 생성  
DROP TRIGGER IF EXISTS trigger_comment_notification ON comments;
CREATE TRIGGER trigger_comment_notification
    AFTER INSERT ON comments
    FOR EACH ROW
    EXECUTE FUNCTION create_comment_notification();

-- 팔로우 시 알림 생성
DROP TRIGGER IF EXISTS trigger_follow_notification ON follows;
CREATE TRIGGER trigger_follow_notification
    AFTER INSERT ON follows
    FOR EACH ROW
    EXECUTE FUNCTION create_follow_notification();

-- 알림 업데이트 시간 자동 갱신
CREATE OR REPLACE FUNCTION update_notification_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_notification_updated_at ON notifications;
CREATE TRIGGER trigger_update_notification_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_notification_updated_at();

-- 더미 알림 데이터 생성 (테스트용)
-- 실제 운영에서는 이 부분을 제거하세요
/*
INSERT INTO notifications (recipient_id, sender_id, type, title, message, related_post_id) VALUES
(
    (SELECT id FROM users LIMIT 1),
    (SELECT id FROM users OFFSET 1 LIMIT 1),
    'like',
    '새로운 좋아요',
    'john_doe님이 회원님의 게시물을 좋아합니다.',
    (SELECT id FROM posts LIMIT 1)
),
(
    (SELECT id FROM users LIMIT 1),
    (SELECT id FROM users OFFSET 1 LIMIT 1),
    'comment',
    '새로운 댓글',
    'jane_smith님이 회원님의 게시물에 댓글을 남겼습니다: "정말 멋진 작품이네요!"',
    (SELECT id FROM posts LIMIT 1)
),
(
    (SELECT id FROM users LIMIT 1),
    (SELECT id FROM users OFFSET 1 LIMIT 1),
    'follow',
    '새로운 팔로워',
    'artist_kim님이 회원님을 팔로우하기 시작했습니다.',
    NULL
);
*/ 