<template>
    <view class="feedback-page">
        <view class="tab-container">
            <view class="tab-item" :class="{ active: activeTab === 'feedback' }" @click="activeTab = 'feedback'">意见反馈</view>
            <view class="tab-item" :class="{ active: activeTab === 'help' }" @click="activeTab = 'help'">常见问题</view>
        </view>

        <view v-if="activeTab === 'feedback'" class="feedback-section">
            <view class="form-group">
                <text class="form-label">反馈类型</text>
                <view class="feedback-type-options">
                    <view class="type-option" :class="{ selected: feedbackForm.type === 'bug' }" @click="feedbackForm.type = 'bug'">Bug 反馈</view>
                    <view class="type-option" :class="{ selected: feedbackForm.type === 'resource' }" @click="feedbackForm.type = 'resource'">资源建议</view>
                    <view class="type-option" :class="{ selected: feedbackForm.type === 'agent' }" @click="feedbackForm.type = 'agent'">智能体建议</view>
                </view>
            </view>

            <view class="form-group">
                <text class="form-label">联系邮箱</text>
                <input v-model="feedbackForm.email" class="form-input" placeholder="请输入邮箱（可选）" type="email" />
            </view>

            <view class="form-group">
                <text class="form-label">反馈内容</text>
                <textarea
                    v-model="feedbackForm.content"
                    class="form-textarea"
                    placeholder="请描述你遇到的问题、希望生成的学习资源，或对智能体协作流程的建议"
                    maxlength="500"
                />
                <text class="char-count">{{ feedbackForm.content.length }}/500</text>
            </view>

            <button class="submit-btn" @click="submitFeedback">提交反馈</button>
            <text class="footer-tips">感谢反馈，Study-mate 会持续改进学习体验。</text>
        </view>

        <view v-if="activeTab === 'help'" class="help-section">
            <view v-for="(item, index) in faqList" :key="index" class="faq-item">
                <view class="faq-title" @click="toggleFAQ(index)">
                    <text class="faq-question">{{ item.question }}</text>
                    <text class="faq-icon" :class="{ expanded: item.expanded }">⌄</text>
                </view>
                <view v-if="item.expanded" class="faq-answer">{{ item.answer }}</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            activeTab: "feedback",
            feedbackForm: {
                type: "resource",
                email: "",
                content: "",
            },
            faqList: [
                {
                    question: "如何生成个性化学习资源？",
                    answer: "先完成学情诊断，再在资源库或 AI 学习助手中说明课程、章节、目标和当前基础，系统会生成讲义、例题或复习计划。",
                    expanded: false,
                },
                {
                    question: "如何查看诊断报告？",
                    answer: "进入学情诊断页面，点击历史学习诊断报告即可查看已保存记录。",
                    expanded: false,
                },
                {
                    question: "如何预约学习导师？",
                    answer: "进入学习导师页面，选择导师后填写学习方向、目标和困难，提交后等待确认。",
                    expanded: false,
                },
                {
                    question: "AI 生成内容可以直接用于作业吗？",
                    answer: "AI 内容适合作为学习辅助。正式作业、考试和项目交付仍需要结合课程要求自行核验。",
                    expanded: false,
                },
            ],
        };
    },
    methods: {
        submitFeedback() {
            if (!this.feedbackForm.content.trim()) {
                uni.showToast({ title: "请输入反馈内容", icon: "none" });
                return;
            }

            const feedbackData = {
                type: this.feedbackForm.type,
                email: this.feedbackForm.email || "未提供",
                content: this.feedbackForm.content,
                timestamp: new Date().toLocaleString(),
            };

            const feedbackHistory = uni.getStorageSync("feedbackHistory") || [];
            feedbackHistory.push(feedbackData);
            uni.setStorageSync("feedbackHistory", feedbackHistory);
            uni.showToast({ title: "感谢反馈", icon: "success", duration: 1600 });
            this.feedbackForm = { type: "resource", email: "", content: "" };
        },
        toggleFAQ(index) {
            this.faqList[index].expanded = !this.faqList[index].expanded;
        },
    },
};
</script>

<style lang="scss" scoped>
.feedback-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #f7fbff 0%, #eef6f2 58%, #f7fbff 100%);
    padding-bottom: 30rpx;
}

.tab-container {
    display: flex;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 4rpx 14rpx rgba(31, 55, 83, 0.08);
}

.tab-item {
    flex: 1;
    padding: 22rpx;
    text-align: center;
    font-size: 28rpx;
    color: #60758a;
    border-bottom: 4rpx solid transparent;
    font-weight: 700;
}

.tab-item.active {
    color: #2f80ed;
    border-bottom-color: #2f80ed;
}

.feedback-section,
.help-section {
    padding: 22rpx;
}

.form-group,
.faq-item {
    background: rgba(255, 255, 255, 0.96);
    border-radius: 18rpx;
    padding: 24rpx;
    margin-bottom: 18rpx;
    box-shadow: 0 10rpx 24rpx rgba(31, 55, 83, 0.1);
}

.form-label {
    display: block;
    font-size: 27rpx;
    color: #16324f;
    font-weight: 800;
    margin-bottom: 16rpx;
}

.feedback-type-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10rpx;
}

.type-option {
    padding: 16rpx 10rpx;
    background: #f8fafc;
    border: 2rpx solid #e3ebf3;
    border-radius: 14rpx;
    text-align: center;
    font-size: 23rpx;
    color: #60758a;
}

.type-option.selected {
    background: #2f80ed;
    border-color: #2f80ed;
    color: #fff;
    font-weight: 800;
}

.form-input,
.form-textarea {
    width: 100%;
    box-sizing: border-box;
    border: 2rpx solid #e3ebf3;
    border-radius: 14rpx;
    background: #f8fafc;
    color: #172b4d;
    font-size: 26rpx;
}

.form-input {
    height: 78rpx;
    padding: 0 18rpx;
}

.form-textarea {
    min-height: 210rpx;
    padding: 18rpx;
}

.char-count {
    display: block;
    text-align: right;
    margin-top: 8rpx;
    font-size: 20rpx;
    color: #8a9aab;
}

.submit-btn {
    width: 100%;
    background: #2f80ed;
    color: #fff;
    border-radius: 18rpx;
    font-size: 28rpx;
    font-weight: 800;
}

.footer-tips {
    display: block;
    margin-top: 18rpx;
    text-align: center;
    color: #60758a;
    font-size: 23rpx;
}

.faq-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.faq-question {
    flex: 1;
    font-size: 27rpx;
    color: #172b4d;
    font-weight: 800;
}

.faq-icon {
    font-size: 28rpx;
    color: #2f80ed;
}

.faq-icon.expanded {
    transform: rotate(180deg);
}

.faq-answer {
    margin-top: 16rpx;
    padding-top: 16rpx;
    border-top: 1rpx solid #edf2f7;
    font-size: 24rpx;
    color: #536578;
    line-height: 1.65;
}
</style>
