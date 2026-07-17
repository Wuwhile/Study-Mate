<template>
    <view class="help-page">
        <view class="section">
            <text class="section-title">快速开始</text>
            <view class="help-card">
                <text class="card-title">1. 完成学情诊断</text>
                <text class="card-text">先选择课程基础、学习目标、时间规划或资源偏好诊断，建立你的学习画像。</text>
            </view>
            <view class="help-card">
                <text class="card-title">2. 生成个性化资源</text>
                <text class="card-text">进入资源库或 AI 学习助手，生成讲义、练习、错题解析、复习计划和项目任务。</text>
            </view>
            <view class="help-card">
                <text class="card-title">3. 让多智能体协同复盘</text>
                <text class="card-text">答疑智能体负责解释，计划智能体负责节奏，评价智能体负责检查覆盖度和难度。</text>
            </view>
        </view>

        <view class="section">
            <text class="section-title">功能说明</text>
            <view class="help-card">
                <text class="card-title">学情诊断</text>
                <text class="card-text">通过问卷和学习数据识别薄弱点，为资源生成提供上下文。</text>
            </view>
            <view class="help-card">
                <text class="card-title">资源生成</text>
                <text class="card-text">根据目标、基础和时间预算生成不同粒度的学习材料。</text>
            </view>
            <view class="help-card">
                <text class="card-title">AI 学习助手</text>
                <text class="card-text">支持课程答疑、错题讲解、知识点类比、学习计划调整和总结提纲。</text>
            </view>
            <view class="help-card">
                <text class="card-title">导师预约</text>
                <text class="card-text">当你需要人工规划或项目评审时，可以预约学习导师确认方案。</text>
            </view>
        </view>

        <view class="section">
            <text class="section-title">常见问题</text>
            <view class="help-card">
                <text class="card-title">Q: 诊断结果有什么用？</text>
                <text class="card-text">A: 它会成为生成资源和学习计划的上下文，让系统避免输出过难、过浅或偏离目标的内容。</text>
            </view>
            <view class="help-card">
                <text class="card-title">Q: AI 生成的内容一定正确吗？</text>
                <text class="card-text">A: 系统会通过评价智能体做初步检查，但关键作业、考试和项目仍建议结合教材、课堂要求和导师意见确认。</text>
            </view>
            <view class="help-card">
                <text class="card-title">Q: 如何保护我的学习数据？</text>
                <text class="card-text">A: 账户、诊断记录和对话数据仅用于提供学习服务，请不要在对话中提交无关敏感信息。</text>
            </view>
        </view>

        <view class="section">
            <text class="section-title">联系我们</text>
            <view class="method" @click="goToFeedback">
                <text class="method-name">在线反馈</text>
                <text class="method-desc">提交问题、建议或资源生成需求</text>
            </view>
            <view class="method">
                <text class="method-name">电子邮箱</text>
                <text class="method-desc">support@studymate.com</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    methods: {
        goToFeedback() {
            uni.navigateTo({ url: "/pages/feedback/index" });
        },
    },
};
</script>

<style lang="scss" scoped>
.help-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #f7fbff 0%, #eef6f2 58%, #f7fbff 100%);
    padding: 22rpx;
}

.section {
    margin-bottom: 30rpx;
}

.section-title {
    display: block;
    font-size: 32rpx;
    font-weight: 800;
    color: #16324f;
    margin-bottom: 16rpx;
    padding-bottom: 10rpx;
    border-bottom: 3rpx solid #2f80ed;
}

.help-card,
.method {
    background: rgba(255, 255, 255, 0.96);
    border-radius: 18rpx;
    padding: 22rpx;
    margin-bottom: 16rpx;
    box-shadow: 0 10rpx 24rpx rgba(31, 55, 83, 0.1);
}

.card-title,
.method-name {
    display: block;
    font-size: 27rpx;
    font-weight: 800;
    color: #2f80ed;
    margin-bottom: 10rpx;
}

.card-text,
.method-desc {
    display: block;
    font-size: 24rpx;
    color: #536578;
    line-height: 1.65;
}
</style>
