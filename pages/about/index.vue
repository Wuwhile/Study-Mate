<template>
    <view class="about-page">
        <view class="section">
            <text class="section-title">应用信息</text>
            <view class="item">
                <text class="label">应用名称</text>
                <text class="value">擎思启学</text>
            </view>
            <view class="item">
                <text class="label">版本号</text>
                <text class="value">2.0.0</text>
            </view>
            <view class="item">
                <text class="label">描述</text>
                <text class="value">擎思启学是面向个性化学习的资源生成与多智能体协同系统，支持学情诊断、资源生成、AI 答疑、学习规划和报告追踪。</text>
            </view>
        </view>

        <view class="section">
            <text class="section-title">系统定位</text>
            <text class="tips">系统基于大模型能力，将诊断智能体、资源生成智能体、答疑智能体、计划智能体和评价智能体组合成学习闭环，帮助学习者获得更贴合目标和基础的学习材料。</text>
        </view>

        <view class="section">
            <text class="section-title">联系我们</text>
            <view class="item">
                <text class="label">邮箱</text>
                <text class="value">support@studymate.com</text>
            </view>
        </view>

        <view class="footer">
            <text class="footer-text">© 2026 擎思启学. All rights reserved.</text>
        </view>
    </view>
</template>

<script>
export default {
    onLoad() {
        uni.setNavigationBarTitle({ title: "关于 擎思启学" });
    },
};
</script>

<style scoped lang="scss">
.about-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #f7fbff 0%, #eef6f2 58%, #fffaf0 100%);
    padding: 22rpx;
}

.section {
    margin-bottom: 24rpx;
    background: rgba(255, 255, 255, 0.96);
    border-radius: 18rpx;
    padding: 26rpx;
    box-shadow: 0 10rpx 24rpx rgba(31, 55, 83, 0.1);
}

.section-title {
    display: block;
    font-size: 29rpx;
    font-weight: 800;
    color: #16324f;
    margin-bottom: 18rpx;
}

.item {
    display: flex;
    flex-direction: column;
    padding: 14rpx 0;
    border-bottom: 1rpx solid #edf2f7;
}

.item:last-child {
    border-bottom: none;
}

.label {
    font-size: 22rpx;
    color: #2f80ed;
    font-weight: 700;
    margin-bottom: 6rpx;
}

.value,
.tips {
    font-size: 24rpx;
    color: #536578;
    line-height: 1.65;
}

.tips {
    display: block;
}

.footer {
    text-align: center;
    padding: 42rpx 20rpx;
}

.footer-text {
    font-size: 20rpx;
    color: #8a9aab;
}
</style>
