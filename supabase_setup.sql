-- Balatro Guide 种子投稿系统建表 SQL
-- 请在 Supabase Dashboard → SQL Editor 中执行

-- 1. 种子表
CREATE TABLE seeds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seed_code TEXT NOT NULL,                    -- 种子代码
  title TEXT NOT NULL,                        -- 标题/简介
  description TEXT,                           -- 详细描述
  recommended_build TEXT,                     -- 推荐流派
  difficulty TEXT DEFAULT '中等',              -- 难度评价
  author TEXT DEFAULT '匿名玩家',             -- 投稿人昵称
  likes INTEGER DEFAULT 0,                    -- 点赞数
  approved BOOLEAN DEFAULT false,             -- 是否审核通过
  created_at TIMESTAMPTZ DEFAULT now()        -- 创建时间
);

-- 2. 点赞记录表（用于防重复点赞）
CREATE TABLE seed_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seed_id UUID REFERENCES seeds(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,                   -- 访客标识（localStorage 生成）
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(seed_id, visitor_id)                 -- 同一人同一种子只能赞一次
);

-- 3. 开启 RLS（行级安全策略）
ALTER TABLE seeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE seed_likes ENABLE ROW LEVEL SECURITY;

-- 4. 安全策略 - seeds 表
-- 所有人可以读取已审核通过的种子
CREATE POLICY "Anyone can read approved seeds"
  ON seeds FOR SELECT
  USING (approved = true);

-- 所有人可以投稿新种子（默认未审核）
CREATE POLICY "Anyone can submit seeds"
  ON seeds FOR INSERT
  WITH CHECK (approved = false);

-- 允许通过 anon 更新 likes 字段（用于点赞计数）
CREATE POLICY "Anyone can update likes count"
  ON seeds FOR UPDATE
  USING (approved = true)
  WITH CHECK (approved = true);

-- 5. 安全策略 - seed_likes 表
-- 所有人可以查看点赞
CREATE POLICY "Anyone can read likes"
  ON seed_likes FOR SELECT
  USING (true);

-- 所有人可以添加点赞
CREATE POLICY "Anyone can add likes"
  ON seed_likes FOR INSERT
  WITH CHECK (true);

-- 6. 授予 anon 和 authenticated 角色表权限
GRANT SELECT, INSERT, UPDATE ON seeds TO anon, authenticated;
GRANT SELECT, INSERT ON seed_likes TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 7. 创建索引
CREATE INDEX idx_seeds_approved ON seeds(approved);
CREATE INDEX idx_seeds_likes ON seeds(likes DESC);
CREATE INDEX idx_seeds_created ON seeds(created_at DESC);
CREATE INDEX idx_seed_likes_visitor ON seed_likes(visitor_id);

-- 7. 创建点赞同步函数（当 seed_likes 插入时自动更新 seeds.likes）
CREATE OR REPLACE FUNCTION update_seed_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE seeds SET likes = (
    SELECT COUNT(*) FROM seed_likes WHERE seed_id = NEW.seed_id
  ) WHERE id = NEW.seed_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_seed_like_added
  AFTER INSERT ON seed_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_seed_likes_count();
