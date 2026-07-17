<template>
    <view class="page-container">
        <view class="header">
            <view>
                <text class="title">擎思启学</text>
                <text class="subtitle">个性化资源生成与学习多智能体系统</text>
            </view>
        </view>

        <view class="content">
            <view class="greeting-section">
                <text class="greeting-text">选择一个学习任务开始</text>
                <text class="greeting-desc">诊断学情、生成资源、协同规划、AI 答疑都在这里完成。</text>
            </view>

            <view class="card-container">
                <view
                    v-for="item in cardList"
                    :key="item.id"
                    class="card"
                    :style="{ background: item.gradient }"
                    @click="navigateTo(item.path)"
                >
                    <view class="card-header">
                        <image class="card-emoji" :src="item.iconPath" mode="aspectFit" />
                        <text class="card-tag">{{ item.tag }}</text>
                    </view>
                    <view class="card-content">
                        <text class="card-title">{{ item.title }}</text>
                        <text class="card-desc">{{ item.desc }}</text>
                    </view>
                    <view class="card-footer">
                        <text class="card-arrow">进入</text>
                    </view>
                </view>
            </view>
        </view>

        <custom-bottom-nav currentPage="home" />
    </view>
</template>

<script>
import customBottomNav from "@/components/customBottomNav/customBottomNav.vue";

export default {
    components: { customBottomNav },
    data() {
        return {
            cardList: [
                {
                    id: 1,
                    title: "学情诊断",
                    desc: "用多维量表识别基础、目标、时间和薄弱知识点",
                    iconPath: "/static/custom-icon-1.png",
                    path: "/pages/phq7-test/index",
                    tag: "诊断智能体",
                    gradient: "linear-gradient(135deg, #2f80ed 0%, #56ccf2 100%)",
                },
                {
                    id: 2,
                    title: "资源库",
                    desc: "按目标生成讲义、例题、错题训练和复习清单",
                    iconPath: "/static/custom-icon-2.png",
                    path: "/pages/health/index",
                    tag: "资源生成",
                    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                },
                {
                    id: 3,
                    title: "学习导师",
                    desc: "预约导师或学习规划员，获得阶段性计划建议",
                    iconPath: "/static/custom-icon-3.png",
                    path: "/pages/psychologist/index",
                    tag: "协同规划",
                    gradient: "linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)",
                },
                {
                    id: 4,
                    title: "AI 学习助手",
                    desc: "随时提问，让答疑、追问、总结智能体协同工作",
                    iconPath: "/static/custom-icon-4.png",
                    path: "/pages/message/message",
                    tag: "多智能体",
                    gradient: "linear-gradient(135deg, #7f53ac 0%, #647dee 100%)",
                },
            ],
        };
    },
    onLoad() {
        uni.hideTabBar();
        if (!uni.getStorageSync("Access-Token")) {
            uni.$u.route("/pages/login/login");
        }
    },
    methods: {
        navigateTo(path) {
            uni.navigateTo({ url: path });
        },
    },
};
</script>

<style lang="scss">
.page-container {
    min-height: 100vh;
    background: linear-gradient(180deg, #f7fbff 0%, #eef6f2 52%, #fffaf0 100%);
    padding-bottom: 140rpx;
}

.header {
    padding: calc(var(--status-bar-height) + 36rpx) 36rpx 32rpx;
    background: linear-gradient(135deg, #16324f 0%, #2f80ed 100%);
    color: #fff;
    box-shadow: 0 10rpx 28rpx rgba(47, 128, 237, 0.22);
}

.title {
    display: block;
    font-size: 44rpx;
    font-weight: 800;
}

.subtitle {
    display: block;
    margin-top: 10rpx;
    font-size: 24rpx;
    opacity: 0.86;
}

.content {
    max-width: 750rpx;
    margin: 0 auto;
}

.greeting-section {
    padding: 34rpx 28rpx 16rpx;
}

.greeting-text {
    display: block;
    font-size: 32rpx;
    font-weight: 700;
    color: #16324f;
}

.greeting-desc {
    display: block;
    margin-top: 10rpx;
    font-size: 24rpx;
    color: #60758a;
    line-height: 1.5;
}

.card-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20rpx;
    padding: 12rpx 24rpx 40rpx;
}

.card {
    min-height: 328rpx;
    border-radius: 20rpx;
    overflow: hidden;
    box-shadow: 0 12rpx 28rpx rgba(31, 55, 83, 0.14);
    display: flex;
    flex-direction: column;
}

.card-header {
    position: relative;
    height: 150rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.18);
}

.card-emoji {
    width: 100rpx;
    height: 100rpx;
}

.card-tag {
    position: absolute;
    top: 14rpx;
    right: 14rpx;
    padding: 6rpx 14rpx;
    border-radius: 16rpx;
    background: rgba(255, 255, 255, 0.92);
    color: #16324f;
    font-size: 20rpx;
    font-weight: 700;
}

.card-content,
.card-footer {
    background: rgba(255, 255, 255, 0.96);
}

.card-content {
    flex: 1;
    padding: 24rpx 22rpx 12rpx;
}

.card-title {
    display: block;
    font-size: 30rpx;
    font-weight: 800;
    color: #172b4d;
    margin-bottom: 10rpx;
}

.card-desc {
    display: block;
    font-size: 22rpx;
    color: #516173;
    line-height: 1.55;
}

.card-footer {
    padding: 0 22rpx 22rpx;
    text-align: right;
}

.card-arrow {
    color: #2f80ed;
    font-size: 24rpx;
    font-weight: 700;
}
</style>
