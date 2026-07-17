<template>
    <view class="diagnosis-container">
        <view class="guide-area">
            <view class="guide-avatar">
                <uni-icons type="staff-filled" size="42" color="#ffffff" />
            </view>
            <view class="guide-speech">
                <text>Hi，我是 Study-mate 的诊断智能体。先完成一个学习画像诊断，我会帮你定位薄弱点并生成后续资源。</text>
            </view>
        </view>

        <scroll-view class="category-nav" scroll-x>
            <view
                v-for="(item, index) in categories"
                :key="item.type"
                class="category-item"
                :class="{ active: currentCategory === index }"
                @click="switchCategory(index)"
            >
                <uni-icons
                    class="category-emoji"
                    :type="item.emoji"
                    size="38"
                    :color="currentCategory === index ? '#ffffff' : '#d4744e'"
                />
                <text>{{ item.name }}</text>
            </view>
        </scroll-view>

        <view class="test-list">
            <view v-for="test in filteredTests" :key="test.id" class="test-card" @click="startTest(test)">
                <view class="card-badge" v-if="test.isNew">NEW</view>
                <view class="test-cover-emoji">
                    <uni-icons :type="test.emoji" size="66" color="#d4744e" />
                </view>
                <view class="test-info">
                    <text class="test-title">{{ test.title }}</text>
                    <text class="test-desc">{{ test.description }}</text>
                    <view class="test-meta">
                        <text>{{ test.questionCount }} 题 · 约 {{ test.duration }} 分钟</text>
                    </view>
                </view>
            </view>
        </view>

        <view class="history-entrance" @click="navToHistory">
            <text>查看历史学习诊断报告</text>
            <text class="arrow">›</text>
        </view>

        <uni-popup ref="infoPopup" type="dialog">
            <view class="test-info-popup">
                <text class="popup-title">{{ currentTest.title }}说明</text>
                <scroll-view scroll-y class="popup-content">
                    <text>{{ currentTest.detailDescription }}</text>
                    <view class="warning-box">
                        <text>诊断结果用于生成学习资源和计划建议，不代表最终能力评价。</text>
                    </view>
                </scroll-view>
                <button class="start-btn" @click="confirmStart">开始诊断</button>
            </view>
        </uni-popup>
    </view>
</template>

<script>
export default {
    data() {
        return {
            currentCategory: 0,
            currentTest: {},
            categories: [
                { name: "基础水平", emoji: "medal", type: "foundation" },
                { name: "学习目标", emoji: "flag-filled", type: "goal" },
                { name: "时间规划", emoji: "calendar", type: "schedule" },
                { name: "学习偏好", emoji: "tune", type: "preference" },
            ],
            testList: [
                {
                    id: "phq7",
                    title: "课程基础诊断",
                    description: "识别当前章节掌握度、先修知识和易错概念",
                    emoji: "paperclip",
                    questionCount: 9,
                    duration: 3,
                    type: "foundation",
                    path: "/pages/phq7-test/do-test?id=foundation",
                    isNew: false,
                    detailDescription: "该诊断会询问课程背景、最近错题、概念理解和实践经验。系统会输出基础等级、薄弱知识点和推荐资源类型。",
                },
                {
                    id: "gad7",
                    title: "知识点掌握诊断",
                    description: "按知识点自评与小题检查生成薄弱点列表",
                    emoji: "map-filled",
                    questionCount: 7,
                    duration: 3,
                    type: "foundation",
                    path: "/pages/phq7-test/do-test?id=knowledge",
                    isNew: true,
                    detailDescription: "适合在学习一个单元后使用。结果会进入学习画像，驱动讲义、例题和复习卡片的个性化生成。",
                },
                {
                    id: "cpss",
                    title: "学习目标清晰度诊断",
                    description: "明确考试、项目、竞赛或能力提升等目标",
                    emoji: "flag-filled",
                    questionCount: 14,
                    duration: 5,
                    type: "goal",
                    path: "/pages/phq7-test/do-test?id=goal",
                    isNew: false,
                    detailDescription: "系统会把抽象目标拆解为可执行阶段目标，并推荐对应的学习路径、资源颗粒度和验收方式。",
                },
                {
                    id: "ucla",
                    title: "协作学习需求诊断",
                    description: "判断是否需要导师、同伴互评或项目协作支持",
                    emoji: "staff",
                    questionCount: 20,
                    duration: 5,
                    type: "goal",
                    path: "/pages/phq7-test/do-test?id=collaboration",
                    isNew: false,
                    detailDescription: "用于识别学习者在讨论、代码评审、题目讲解、项目推进中的协作需求。",
                },
                {
                    id: "its",
                    title: "每周学习时间诊断",
                    description: "评估可用时间、专注时段和复习节奏",
                    emoji: "calendar-filled",
                    questionCount: 12,
                    duration: 4,
                    type: "schedule",
                    path: "/pages/phq7-test/do-test?id=schedule",
                    isNew: false,
                    detailDescription: "计划智能体会根据诊断结果生成每日任务量，避免计划过满或过松。",
                },
                {
                    id: "psqi",
                    title: "复习节奏诊断",
                    description: "定位预习、练习、复盘、测试之间的时间分配",
                    emoji: "refresh",
                    questionCount: 7,
                    duration: 3,
                    type: "schedule",
                    path: "/pages/phq7-test/do-test?id=review",
                    isNew: false,
                    detailDescription: "用于生成滚动复习计划，让错题和薄弱点在合适间隔被再次唤醒。",
                },
                {
                    id: "sds",
                    title: "资源偏好诊断",
                    description: "确定你更适合讲义、视频脚本、例题还是项目任务",
                    emoji: "compose",
                    questionCount: 10,
                    duration: 4,
                    type: "preference",
                    path: "/pages/phq7-test/do-test?id=preference",
                    isNew: false,
                    detailDescription: "资源生成智能体会根据偏好调整输出形式，例如更详细的步骤、更短的卡片或更多示例。",
                },
            ],
        };
    },
    computed: {
        filteredTests() {
            const currentType = this.categories[this.currentCategory].type;
            return this.testList.filter((item) => item.type === currentType);
        },
    },
    methods: {
        switchCategory(index) {
            this.currentCategory = index;
        },
        startTest(test) {
            this.currentTest = test;
            this.$refs.infoPopup.open();
        },
        confirmStart() {
            this.$refs.infoPopup.close();
            uni.navigateTo({ url: this.currentTest.path });
        },
        navToHistory() {
            uni.navigateTo({ url: "/pages/phq7-test/history" });
        },
    },
};
</script>

<style lang="scss">
.diagnosis-container {
    min-height: 100vh;
    background: linear-gradient(180deg, #f7fbff 0%, #eef6f2 58%, #fffaf0 100%);
    padding-bottom: 120rpx;
}

.guide-area {
    display: flex;
    padding: 30rpx;
    margin: 20rpx;
    background: rgba(255, 255, 255, 0.96);
    border-radius: 20rpx;
    box-shadow: 0 10rpx 24rpx rgba(31, 55, 83, 0.1);
}

.guide-avatar {
    width: 92rpx;
    height: 92rpx;
    flex: 0 0 92rpx;
    margin-right: 20rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #e8a183 0%, #d4744e 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 18rpx rgba(212, 116, 78, 0.22);
}

.guide-speech {
    flex: 1;
    padding: 18rpx;
    border-radius: 16rpx;
    background: #edf5ff;
    color: #16324f;
    line-height: 1.6;
    font-size: 26rpx;
}

.category-nav {
    white-space: nowrap;
    padding: 18rpx 0;
    margin: 0 30rpx;
}

.category-item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 0 30rpx;
    opacity: 0.62;

    text {
        font-size: 26rpx;
        font-weight: 650;
    }
}

.category-item.active {
    opacity: 1;
    text {
        color: #2f80ed;
        font-weight: 800;
    }
}

.category-emoji {
    margin-bottom: 12rpx;
}

.test-list {
    padding: 0 30rpx;
}

.test-card {
    position: relative;
    display: flex;
    min-height: 210rpx;
    margin-bottom: 24rpx;
    background: rgba(255, 255, 255, 0.96);
    border-radius: 18rpx;
    overflow: hidden;
    box-shadow: 0 10rpx 24rpx rgba(31, 55, 83, 0.1);
}

.card-badge {
    position: absolute;
    top: 18rpx;
    right: 18rpx;
    background: #f2994a;
    color: #fff;
    padding: 4rpx 12rpx;
    border-radius: 14rpx;
    font-size: 20rpx;
    font-weight: 800;
}

.test-cover-emoji {
    width: 205rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #edf5ff;
}

.test-info {
    flex: 1;
    padding: 24rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.test-title {
    font-size: 35rpx;
    font-weight: 800;
    color: #172b4d;
}

.test-desc {
    font-size: 27rpx;
    color: #536578;
    line-height: 1.45;
}

.test-meta {
    font-size: 24rpx;
    color: #8a9aab;
}

.history-entrance {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 36rpx 30rpx 0;
    padding: 24rpx;
    border-radius: 18rpx;
    background: #16324f;
    color: #fff;
    font-size: 27rpx;
    font-weight: 700;
}

.arrow {
    margin-left: 10rpx;
    font-size: 36rpx;
}

.test-info-popup {
    width: 650rpx;
    padding: 38rpx;
    border-radius: 20rpx;
    background: #fff;
}

.popup-title {
    display: block;
    text-align: center;
    font-size: 34rpx;
    font-weight: 800;
    margin-bottom: 26rpx;
    color: #16324f;
}

.popup-content {
    max-height: 58vh;
    margin-bottom: 28rpx;
    font-size: 27rpx;
    line-height: 1.8;
    color: #536578;
}

.warning-box {
    margin-top: 24rpx;
    padding: 18rpx;
    border-radius: 14rpx;
    background: #fff4d8;
    color: #946200;
}

.start-btn {
    background: #2f80ed;
    color: #fff;
    border-radius: 16rpx;
    font-weight: 800;
}
</style>
