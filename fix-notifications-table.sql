-- GaNaDa 알림 테이블 수정 스크립트
-- 기존 notifications 테이블을 안전하게 업데이트합니다

-- 1. 기존 notifications 테이블 구조 확인
-- \d notifications;

-- 2. 기존 테이블이 있다면 백업 (선택사항)
-- CREATE TABLE notifications_backup AS SELECT * FROM notifications;

-- 3. 기존 notifications 테이블 삭제 (데이터가 중요하지 않은 경우)
DROP TABLE IF EXISTS notifications CASCADE;

-- 4. 새로운 notifications 테이블 생성
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_id UUID NOT NULL,
    sender_id UUID,
    type VARCHAR(50) NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'post')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_post_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. users 테이블이 존재하는 경우에만 외래키 제약조건 추가
DO $$
BEGIN
    -- users 테이블 존재 확인
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        -- 외래키 제약조건 추가
        ALTER TABLE notifications 
        ADD CONSTRAINT fk_notifications_recipient 
        FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE;
        
        ALTER TABLE notifications 
        ADD CONSTRAINT fk_notifications_sender 
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE;
        
        RAISE NOTICE '✅ users 테이블과의 외래키 제약조건이 추가되었습니다.';
    ELSE
        RAISE NOTICE '⚠️ users 테이블이 없습니다. 먼저 users 테이블을 생성하세요.';
    END IF;
    
    -- posts 테이블 존재 확인
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts') THEN
        ALTER TABLE notifications 
        ADD CONSTRAINT fk_notifications_post 
        FOREIGN KEY (related_post_id) REFERENCES posts(id) ON DELETE CASCADE;
        
        RAISE NOTICE '✅ posts 테이블과의 외래키 제약조건이 추가되었습니다.';
    ELSE
        RAISE NOTICE '⚠️ posts 테이블이 없습니다. 나중에 posts 테이블 생성 후 제약조건을 추가하세요.';
    END IF;
END $$;

-- 6. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- 7. RLS (Row Level Security) 정책 설정
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 기존 정책이 있다면 삭제
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;

-- 새로운 정책 생성
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "Authenticated users can create notifications" ON notifications
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = recipient_id);

CREATE POLICY "Users can delete their own notifications" ON notifications
    FOR DELETE USING (auth.uid() = recipient_id);

-- 8. updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_notifications_updated_at ON notifications;
CREATE TRIGGER trigger_update_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

-- 9. 테스트용 더미 데이터 (선택사항)
-- 실제 운영에서는 이 부분을 주석 처리하세요
/*
INSERT INTO notifications (recipient_id, sender_id, type, title, message) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'follow', '새로운 팔로워', 'test_user님이 회원님을 팔로우하기 시작했습니다.'),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'like', '새로운 좋아요', 'artist_kim님이 회원님의 게시물을 좋아합니다.');
*/

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '✅ notifications 테이블이 성공적으로 생성/수정되었습니다!';
    RAISE NOTICE '📝 다음 단계:';
    RAISE NOTICE '1. 웹사이트에서 로그인 후 알림 기능을 테스트하세요';
    RAISE NOTICE '2. 좋아요, 댓글, 팔로우 등의 액션을 통해 알림이 생성되는지 확인하세요';
END $$; 