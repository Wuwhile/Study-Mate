<template>
    <view class="diagnosis-page">
        <view v-if="!showResult" class="question-card">
            <view class="progress">
                <text>{{ currentIndex + 1 }} / {{ questions.length }}</text>
                <view class="progress-bar">
                    <view class="progress-fill" :style="{ width: progress + '%' }"></view>
                </view>
            </view>

            <text class="question-title">{{ currentQuestion.text }}</text>
            <text class="question-tip">{{ currentQuestion.tip }}</text>

            <view class="options">
                <view
                    v-for="option in currentQuestion.options"
                    :key="option.value"
                    class="option"
                    :class="{ selected: answers[currentIndex] === option.value }"
                    @click="selectOption(option.value)"
                >
                    <text class="option-label">{{ option.label }}</text>
                    <text class="option-desc">{{ option.desc }}</text>
                </view>
            </view>

            <view class="actions">
                <button class="ghost-btn" :disabled="currentIndex === 0" @click="prevQuestion">上一题</button>
                <button class="primary-btn" @click="nextQuestion">{{ currentIndex === questions.length - 1 ? "生成报告" : "下一题" }}</button>
            </view>
        </view>

        <view v-else class="result-card">
            <text class="result-title">学习画像诊断报告</text>
            <view class="score-block">
                <text class="score">{{ totalScore }}</text>
                <text class="score-label">综合学习准备度</text>
            </view>
            <view class="result-section">
                <text class="section-title">{{ result.level }}</text>
                <text class="section-text">{{ result.description }}</text>
            </view>
            <view class="result-section">
                <text class="section-title">推荐资源</text>
                <text class="section-text">{{ result.resources }}</text>
            </view>
            <view class="result-section">
                <text class="section-title">下一步行动</text>
                <text class="section-text">{{ result.nextStep }}</text>
            </view>
            <button class="primary-btn" @click="saveResult">保存报告</button>
            <button class="ghost-btn full" @click="goBack">返回诊断列表</button>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            diagnosisId: "foundation",
            currentIndex: 0,
            answers: [],
            showResult: false,
            questions: [
                {
                    text: "你对当前课程核心概念的掌握程度如何？",
                    tip: "请选择最接近当前状态的一项",
                    options: [
                        { label: "刚开始", desc: "概念还比较陌生", value: 1 },
                        { label: "能看懂", desc: "看讲义能理解，但独立做题困难", value: 2 },
                        { label: "能应用", desc: "能完成常规题目或小任务", value: 3 },
                        { label: "能迁移", desc: "能解释给别人并迁移到新问题", value: 4 },
                    ],
                },
                {
                    text: "遇到错题或项目卡点时，你通常能定位原因吗？",
                    tip: "这会影响系统生成解析的详细程度",
                    options: [
                        { label: "很难定位", desc: "只知道答案不对", value: 1 },
                        { label: "偶尔能定位", desc: "需要提示才能发现问题", value: 2 },
                        { label: "多数能定位", desc: "知道是概念、步骤还是实现问题", value: 3 },
                        { label: "能主动复盘", desc: "会整理错因并做同类题", value: 4 },
                    ],
                },
                {
                    text: "你每周能稳定投入多少学习时间？",
                    tip: "计划智能体会据此控制任务量",
                    options: [
                        { label: "少于 3 小时", desc: "适合碎片化卡片和短练习", value: 1 },
                        { label: "3-6 小时", desc: "适合小节推进和轻量练习", value: 2 },
                        { label: "6-10 小时", desc: "可以安排项目任务和复盘", value: 3 },
                        { label: "10 小时以上", desc: "适合密集训练和阶段验收", value: 4 },
                    ],
                },
                {
                    text: "你更希望系统优先生成哪类资源？",
                    tip: "用于资源生成智能体选择输出格式",
                    options: [
                        { label: "概念讲义", desc: "先补知识框架", value: 2 },
                        { label: "例题解析", desc: "通过样题理解步骤", value: 3 },
                        { label: "专项练习", desc: "通过训练提高熟练度", value: 3 },
                        { label: "项目任务", desc: "通过实践整合知识", value: 4 },
                    ],
                },
                {
                    text: "你的学习目标是否清晰？",
                    tip: "目标越明确，资源越容易个性化",
                    options: [
                        { label: "不清晰", desc: "只是想学一学", value: 1 },
                        { label: "有方向", desc: "知道课程或主题", value: 2 },
                        { label: "有任务", desc: "有考试、作业或项目", value: 3 },
                        { label: "有验收标准", desc: "知道何时算学会", value: 4 },
                    ],
                },
            ],
        };
    },
    computed: {
        currentQuestion() {
            return this.questions[this.currentIndex];
        },
        progress() {
            return Math.round(((this.currentIndex + 1) / this.questions.length) * 100);
        },
        totalScore() {
            return this.answers.reduce((sum, item) => sum + (item || 0), 0);
        },
        result() {
            if (this.totalScore <= 8) {
                return {
                    level: "基础补齐阶段",
                    description: "当前更适合先建立概念框架，避免直接进入高难项目。",
                    resources: "建议生成入门讲义、术语卡片、基础例题和低门槛练习。",
                    nextStep: "先完成 2-3 个核心概念的学习卡片，再让 AI 生成同类小题。",
                };
            }
            if (this.totalScore <= 14) {
                return {
                    level: "稳步提升阶段",
                    description: "已经具备一定基础，可以通过例题和专项练习提升稳定性。",
                    resources: "建议生成知识点讲解、分层例题、错题归因表和每周复习计划。",
                    nextStep: "选择一个薄弱知识点，让 AI 学习助手生成讲义和 5 道递进题。",
                };
            }
            return {
                level: "项目迁移阶段",
                description: "可以进入综合任务，用项目或限时训练检验知识迁移能力。",
                resources: "建议生成项目任务书、验收清单、代码/答案评审标准和冲刺计划。",
                nextStep: "进入学习导师或 AI 助手，生成一个可交付的小项目学习路径。",
            };
        },
    },
    methods: {
        selectOption(value) {
            this.$set(this.answers, this.currentIndex, value);
        },
        nextQuestion() {
            if (!this.answers[this.currentIndex]) {
                uni.showToast({ title: "请选择一个选项", icon: "none" });
                return;
            }
            if (this.currentIndex < this.questions.length - 1) {
                this.currentIndex += 1;
            } else {
                this.showResult = true;
            }
        },
        prevQuestion() {
            if (this.currentIndex > 0) this.currentIndex -= 1;
        },
        async saveResult() {
            try {
                const payload = {
                    questionnaireName: "Study-mate 学习画像诊断",
                    questionnaireType: this.diagnosisId,
                    score: this.totalScore,
                    depressionLevel: this.result.level,
                    levelDescription: this.result.description,
                    resultData: {
                        answers: this.answers,
                        resources: this.result.resources,
                        nextStep: this.result.nextStep,
                    },
                };
                const result = await this.$api.questionnaire.saveResult(payload);
                if (result.code === 200) {
                    uni.showToast({ title: "报告已保存", icon: "success" });
                } else {
                    uni.showToast({ title: result.message || "保存失败", icon: "none" });
                }
            } catch (error) {
                uni.showToast({ title: "保存失败，请稍后重试", icon: "none" });
            }
        },
        goBack() {
            uni.navigateBack();
        },
    },
    onLoad(options) {
        this.diagnosisId = options.id || "foundation";
    },
};
</script>

<style lang="scss">
.diagnosis-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #f7fbff 0%, #eef6f2 58%, #fffaf0 100%);
    padding: 28rpx;
}

.question-card,
.result-card {
    background: rgba(255, 255, 255, 0.96);
    border-radius: 20rpx;
    padding: 32rpx;
    box-shadow: 0 10rpx 24rpx rgba(31, 55, 83, 0.1);
}

.progress {
    font-size: 24rpx;
    color: #60758a;
    margin-bottom: 28rpx;
}

.progress-bar {
    height: 10rpx;
    background: #e3ebf3;
    border-radius: 999rpx;
    margin-top: 12rpx;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: #2f80ed;
}

.question-title,
.result-title {
    display: block;
    font-size: 34rpx;
    font-weight: 800;
    color: #16324f;
    line-height: 1.4;
}

.question-tip {
    display: block;
    margin-top: 12rpx;
    font-size: 24rpx;
    color: #60758a;
}

.options {
    margin: 30rpx 0;
}

.option {
    padding: 22rpx;
    margin-bottom: 16rpx;
    border: 2rpx solid #e3ebf3;
    border-radius: 16rpx;
    background: #f8fafc;
}

.option.selected {
    border-color: #2f80ed;
    background: #edf5ff;
}

.option-label {
    display: block;
    font-size: 28rpx;
    font-weight: 800;
    color: #172b4d;
}

.option-desc {
    display: block;
    margin-top: 8rpx;
    font-size: 23rpx;
    color: #60758a;
}

.actions {
    display: flex;
    gap: 16rpx;
}

.primary-btn,
.ghost-btn {
    flex: 1;
    border-radius: 16rpx;
    font-weight: 800;
}

.primary-btn {
    background: #2f80ed;
    color: #fff;
}

.ghost-btn {
    background: #edf5ff;
    color: #2f80ed;
}

.ghost-btn.full {
    margin-top: 16rpx;
}

.score-block {
    margin: 30rpx 0;
    padding: 30rpx;
    border-radius: 18rpx;
    background: #edf5ff;
    text-align: center;
}

.score {
    display: block;
    font-size: 68rpx;
    font-weight: 900;
    color: #2f80ed;
}

.score-label {
    font-size: 24rpx;
    color: #60758a;
}

.result-section {
    margin-bottom: 26rpx;
}

.section-title {
    display: block;
    font-size: 28rpx;
    font-weight: 800;
    color: #16324f;
    margin-bottom: 10rpx;
}

.section-text {
    display: block;
    font-size: 25rpx;
    color: #536578;
    line-height: 1.7;
}
</style>
