<template>
    <view class="mentor-container">
        <view class="header">
            <view class="appointment-record" @click="goToAppointmentRecord">
                <text>预约记录</text>
            </view>
        </view>

        <view class="search-section">
            <view class="search-bar">
                <uni-icons
                    class="search-icon"
                    type="search"
                    size="26"
                    color="#999999"
                />
                <input
                    class="search-input"
                    placeholder="搜索导师姓名、课程或擅长方向"
                    v-model="searchKeyword"
                    @input="handleSearch"
                />
            </view>
        </view>

        <view class="mentor-list" v-if="!loading">
            <view v-if="filteredMentors.length === 0" class="empty-state">
                <text class="empty-text">暂无匹配导师</text>
                <text class="empty-desc">换一个关键词试试</text>
            </view>

            <view v-for="mentor in filteredMentors" :key="mentor.id" class="mentor-card" @click="viewMentorDetail(mentor)">
                <view class="card-header">
                    <view class="avatar-container">
                        <image :src="mentor.avatar" class="mentor-avatar" mode="aspectFill" />
                        <view class="online-status" :class="{ online: mentor.isOnline }"></view>
                    </view>
                    <view class="mentor-info">
                        <text class="mentor-name">{{ mentor.name }}</text>
                        <view class="basic-info">
                            <text>{{ mentor.experience }} 年经验</text>
                            <text>{{ mentor.title }}</text>
                        </view>
                    </view>
                    <view class="rating-section">
                        <text class="rating-score">{{ mentor.rating }}</text>
                        <text class="rating-count">{{ mentor.reviewCount }} 评价</text>
                    </view>
                </view>

                <view class="card-content">
                    <text class="specialty-label">擅长方向</text>
                    <view class="specialty-tags">
                        <text v-for="specialty in mentor.specialties" :key="specialty" class="specialty-tag">{{ specialty }}</text>
                    </view>
                    <text class="intro-text">{{ mentor.introduction }}</text>
                </view>

                <view class="card-footer">
                    <button class="appointment-btn" @click.stop="makeAppointment(mentor)">预约学习规划</button>
                </view>
            </view>
        </view>

        <view class="loading-container" v-if="loading">
            <view class="loading-spinner"></view>
            <text>加载导师中...</text>
        </view>

        <view class="detail-modal" v-if="showDetail" @click="closeDetail">
            <view class="detail-content" @click.stop>
                <view class="detail-header">
                    <view class="mentor-profile">
                        <image :src="selectedMentor.avatar" class="detail-avatar" mode="aspectFill" />
                        <view>
                            <text class="detail-name">{{ selectedMentor.name }}</text>
                            <text class="detail-title">{{ selectedMentor.title }}</text>
                        </view>
                    </view>
                    <view class="close-btn" @click="closeDetail">×</view>
                </view>
                <scroll-view scroll-y class="detail-body">
                    <view class="detail-section">
                        <text class="section-label">擅长方向</text>
                        <view class="specialty-list">
                            <text v-for="specialty in selectedMentor.specialties" :key="specialty" class="specialty-item">{{ specialty }}</text>
                        </view>
                    </view>
                    <view class="detail-section">
                        <text class="section-label">导师简介</text>
                        <text class="detail-intro">{{ selectedMentor.introduction }}</text>
                    </view>
                    <view class="detail-section">
                        <text class="section-label">专业背景</text>
                        <text class="detail-background">{{ selectedMentor.background }}</text>
                    </view>
                </scroll-view>
                <view class="detail-footer">
                    <button class="detail-appointment-btn" @click="makeAppointment(selectedMentor)">预约学习规划</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            loading: true,
            searchKeyword: "",
            showDetail: false,
            selectedMentor: {},
            mentors: [
                {
                    id: 1,
                    name: "林知远",
                    experience: 8,
                    title: "学习规划导师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mentor1&backgroundColor=b6e3f4",
                    rating: 4.9,
                    reviewCount: 1286,
                    isOnline: true,
                    specialties: ["学习路径规划", "Python 入门", "错题复盘"],
                    introduction: "擅长把模糊学习目标拆成可执行周计划，并结合 AI 资源生成形成闭环。",
                    background: "计算机教育方向硕士，长期负责程序设计课程辅导与项目制学习设计。",
                },
                {
                    id: 2,
                    name: "许安澜",
                    experience: 10,
                    title: "AI 课程导师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mentor2&backgroundColor=c7a2ff",
                    rating: 4.8,
                    reviewCount: 940,
                    isOnline: true,
                    specialties: ["大模型应用", "提示词工程", "多智能体系统"],
                    introduction: "关注大模型应用开发，帮助学习者完成从需求分析到系统原型的实践路线。",
                    background: "人工智能应用开发导师，参与多个教育智能体项目设计与评审。",
                },
                {
                    id: 3,
                    name: "周明川",
                    experience: 12,
                    title: "项目实践导师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mentor3&backgroundColor=ffd1dc",
                    rating: 4.9,
                    reviewCount: 1510,
                    isOnline: false,
                    specialties: ["课程设计", "后端接口", "数据库建模"],
                    introduction: "擅长指导学生把课程选题转化为前后端可交付系统，重视数据结构和接口边界。",
                    background: "软件工程课程导师，长期指导毕业设计、创新项目和企业实训。",
                },
                {
                    id: 4,
                    name: "唐若宁",
                    experience: 6,
                    title: "考前冲刺导师",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mentor4&backgroundColor=ffdfba",
                    rating: 4.7,
                    reviewCount: 768,
                    isOnline: true,
                    specialties: ["考点梳理", "限时训练", "复习节奏"],
                    introduction: "帮助学习者压缩复习范围，生成考前高频知识点清单和针对性训练计划。",
                    background: "教育测评与学习分析方向研究者，熟悉形成性评价和学习数据分析。",
                },
            ],
        };
    },
    computed: {
        filteredMentors() {
            if (!this.searchKeyword) return this.mentors;
            const keyword = this.searchKeyword.toLowerCase();
            return this.mentors.filter(
                (mentor) =>
                    mentor.name.toLowerCase().includes(keyword) ||
                    mentor.specialties.some((item) => item.toLowerCase().includes(keyword)) ||
                    mentor.introduction.toLowerCase().includes(keyword),
            );
        },
    },
    methods: {
        async loadMentors() {
            this.loading = true;
            await new Promise((resolve) => setTimeout(resolve, 300));
            this.loading = false;
        },
        handleSearch() {},
        viewMentorDetail(mentor) {
            this.selectedMentor = mentor;
            this.showDetail = true;
        },
        closeDetail() {
            this.showDetail = false;
            this.selectedMentor = {};
        },
        makeAppointment(mentor) {
            uni.navigateTo({
                url: `/pages/psychologist/appointment?doctorId=${mentor.id}&doctorName=${encodeURIComponent(mentor.name)}&doctorTitle=${encodeURIComponent(mentor.title)}&doctorAvatar=${encodeURIComponent(mentor.avatar)}&doctorSpecialties=${encodeURIComponent(mentor.specialties.join(","))}`,
            });
        },
        goToAppointmentRecord() {
            uni.navigateTo({ url: "/pages/psychologist/record" });
        },
    },
    onShow() {
        this.loadMentors();
    },
};
</script>

<style lang="scss">
.mentor-container {
    min-height: 100vh;
    background: linear-gradient(180deg, #f7fbff 0%, #eef6f2 58%, #fffaf0 100%);
    padding-bottom: 40rpx;
}

.header {
    display: flex;
    justify-content: flex-end;
    padding: 36rpx 30rpx 20rpx;
    background: linear-gradient(135deg, #16324f 0%, #2f80ed 100%);
}

.appointment-record {
    color: #fff;
    background: rgba(255, 255, 255, 0.18);
    border-radius: 18rpx;
    padding: 12rpx 20rpx;
    font-size: 24rpx;
    font-weight: 700;
}

.search-section {
    padding: 20rpx 30rpx;
}

.search-bar {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 18rpx;
    padding: 18rpx 24rpx;
    box-shadow: 0 8rpx 20rpx rgba(31, 55, 83, 0.08);
}

.search-icon {
    margin-right: 12rpx;
}

.search-input {
    flex: 1;
    font-size: 27rpx;
}

.mentor-list {
    padding: 0 30rpx;
}

.mentor-card {
    background: rgba(255, 255, 255, 0.96);
    border-radius: 18rpx;
    padding: 28rpx;
    margin-bottom: 22rpx;
    box-shadow: 0 10rpx 24rpx rgba(31, 55, 83, 0.1);
}

.card-header {
    display: flex;
    align-items: center;
}

.avatar-container {
    position: relative;
    margin-right: 18rpx;
}

.mentor-avatar,
.detail-avatar {
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    background: #edf5ff;
}

.online-status {
    position: absolute;
    right: 2rpx;
    bottom: 4rpx;
    width: 18rpx;
    height: 18rpx;
    border-radius: 50%;
    background: #b8c2cc;
    border: 3rpx solid #fff;
}

.online-status.online {
    background: #18a058;
}

.mentor-info {
    flex: 1;
}

.mentor-name {
    display: block;
    font-size: 31rpx;
    font-weight: 800;
    color: #172b4d;
    margin-bottom: 8rpx;
}

.basic-info {
    display: flex;
    gap: 10rpx;
    flex-wrap: wrap;
    text {
        font-size: 21rpx;
        color: #60758a;
        background: #f1f5f9;
        padding: 4rpx 10rpx;
        border-radius: 10rpx;
    }
}

.rating-section {
    text-align: right;
}

.rating-score {
    display: block;
    font-size: 28rpx;
    font-weight: 800;
    color: #f2994a;
}

.rating-count {
    font-size: 19rpx;
    color: #8a9aab;
}

.card-content {
    padding: 22rpx 0;
}

.specialty-label,
.section-label {
    display: block;
    font-size: 24rpx;
    color: #60758a;
    font-weight: 700;
    margin-bottom: 10rpx;
}

.specialty-tags,
.specialty-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
    margin-bottom: 14rpx;
}

.specialty-tag,
.specialty-item {
    font-size: 20rpx;
    color: #2f80ed;
    background: #edf5ff;
    padding: 6rpx 12rpx;
    border-radius: 12rpx;
}

.intro-text,
.detail-intro,
.detail-background {
    display: block;
    font-size: 25rpx;
    color: #536578;
    line-height: 1.65;
}

.card-footer {
    text-align: right;
}

.appointment-btn,
.detail-appointment-btn {
    background: #2f80ed;
    color: #fff;
    border-radius: 16rpx;
    font-size: 26rpx;
    font-weight: 800;
}

.empty-state,
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 110rpx 40rpx;
    color: #60758a;
}

.empty-text {
    font-size: 30rpx;
    font-weight: 800;
}

.detail-modal {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40rpx;
}

.detail-content {
    width: 100%;
    max-width: 630rpx;
    max-height: 86vh;
    background: #fff;
    border-radius: 20rpx;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx;
    border-bottom: 1rpx solid #e8eef5;
}

.mentor-profile {
    display: flex;
    align-items: center;
    gap: 18rpx;
}

.detail-name {
    display: block;
    font-size: 31rpx;
    font-weight: 800;
}

.detail-title {
    font-size: 24rpx;
    color: #60758a;
}

.close-btn {
    width: 52rpx;
    height: 52rpx;
    border-radius: 50%;
    background: #f1f5f9;
    text-align: center;
    line-height: 52rpx;
    font-size: 36rpx;
    color: #60758a;
}

.detail-body {
    padding: 30rpx 32rpx;
    max-height: 58vh;
}

.detail-section {
    margin-bottom: 26rpx;
}

.detail-footer {
    padding: 22rpx 32rpx 32rpx;
}
</style>
