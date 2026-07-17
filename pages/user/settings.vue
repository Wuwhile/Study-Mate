<template>
    <view class="settings-container">
        <view class="settings-section">
            <view class="section-title">学习数据</view>
            <view class="settings-item">
                <view class="item-left">
                    <text class="item-label">保存学习画像</text>
                    <text class="item-desc">用于生成更贴合基础和目标的资源</text>
                </view>
                <switch :checked="settings.saveLearningProfile" @change="toggleSetting('saveLearningProfile')" color="#2f80ed" />
            </view>
            <view class="settings-item">
                <view class="item-left">
                    <text class="item-label">允许个性化推荐</text>
                    <text class="item-desc">根据诊断和错题推荐讲义、练习和复习计划</text>
                </view>
                <switch :checked="settings.personalRecommendation" @change="toggleSetting('personalRecommendation')" color="#2f80ed" />
            </view>
        </view>

        <view class="settings-section">
            <view class="section-title">通知设置</view>
            <view class="settings-item">
                <view class="item-left">
                    <text class="item-label">学习计划提醒</text>
                    <text class="item-desc">提醒你完成每日学习任务和复盘</text>
                </view>
                <switch :checked="settings.planReminder" @change="toggleSetting('planReminder')" color="#2f80ed" />
            </view>
            <view class="settings-item">
                <view class="item-left">
                    <text class="item-label">资源生成提醒</text>
                    <text class="item-desc">资源或报告生成完成后通知你查看</text>
                </view>
                <switch :checked="settings.resourceReminder" @change="toggleSetting('resourceReminder')" color="#2f80ed" />
            </view>
            <view class="settings-item">
                <view class="item-left">
                    <text class="item-label">导师预约提醒</text>
                    <text class="item-desc">预约确认和学习规划更新时通知</text>
                </view>
                <switch :checked="settings.appointmentReminder" @change="toggleSetting('appointmentReminder')" color="#2f80ed" />
            </view>
        </view>

        <view class="settings-section">
            <view class="section-title">显示设置</view>
            <view class="settings-item" @click="fontModalVisible = true">
                <view class="item-left">
                    <text class="item-label">字体大小</text>
                    <text class="item-desc">{{ fontSizeLabel }}</text>
                </view>
                <text class="menu-arrow">&gt;</text>
            </view>
        </view>

        <view class="settings-section">
            <view class="section-title">数据与协议</view>
            <view class="settings-item" @click="showPrivacy">
                <view class="item-left">
                    <text class="item-label">隐私政策</text>
                    <text class="item-desc">了解擎思启学如何处理学习数据</text>
                </view>
                <text class="menu-arrow">&gt;</text>
            </view>
            <view class="settings-item" @click="showTerms">
                <view class="item-left">
                    <text class="item-label">用户协议</text>
                    <text class="item-desc">查看服务条款和使用边界</text>
                </view>
                <text class="menu-arrow">&gt;</text>
            </view>
            <view class="settings-item" @click="confirmClearCache">
                <view class="item-left">
                    <text class="item-label">清空缓存</text>
                    <text class="item-desc">删除本地临时数据</text>
                </view>
                <text class="menu-arrow">&gt;</text>
            </view>
        </view>

        <view class="settings-section">
            <view class="section-title">关于</view>
            <view class="settings-item">
                <view class="item-left">
                    <text class="item-label">应用版本</text>
                    <text class="item-desc">v2.0.0</text>
                </view>
            </view>
        </view>

        <uni-popup ref="fontPopup" type="bottom" :maskClick="true">
            <view class="popup-container">
                <view class="popup-header">
                    <text class="popup-title">选择字体大小</text>
                    <view class="close-btn" @click="fontModalVisible = false">×</view>
                </view>
                <view class="popup-content font-options">
                    <view class="font-option" :class="{ selected: settings.fontSize === 'small' }" @click="changeFontSize('small')">
                        <text class="font-preview small">Aa</text>
                        <text class="font-name">小</text>
                    </view>
                    <view class="font-option" :class="{ selected: settings.fontSize === 'medium' }" @click="changeFontSize('medium')">
                        <text class="font-preview medium">Aa</text>
                        <text class="font-name">中</text>
                    </view>
                    <view class="font-option" :class="{ selected: settings.fontSize === 'large' }" @click="changeFontSize('large')">
                        <text class="font-preview large">Aa</text>
                        <text class="font-name">大</text>
                    </view>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
export default {
    data() {
        return {
            settings: {
                saveLearningProfile: true,
                personalRecommendation: true,
                planReminder: true,
                resourceReminder: true,
                appointmentReminder: true,
                fontSize: this.$themeManager.getFontSize(),
            },
            fontModalVisible: false,
        };
    },
    computed: {
        fontSizeLabel() {
            return { small: "小", medium: "中", large: "大" }[this.settings.fontSize] || "中";
        },
    },
    watch: {
        fontModalVisible(newVal) {
            if (newVal) this.$refs.fontPopup?.open();
            else this.$refs.fontPopup?.close();
        },
    },
    onLoad() {
        this.loadSettings();
    },
    onShow() {
        this.settings.fontSize = this.$themeManager.getFontSize();
    },
    methods: {
        loadSettings() {
            const savedSettings = uni.getStorageSync("userSettings");
            if (savedSettings) this.settings = Object.assign(this.settings, savedSettings);
        },
        toggleSetting(key) {
            this.settings[key] = !this.settings[key];
            this.saveSettings();
        },
        changeFontSize(size) {
            this.settings.fontSize = size;
            this.$themeManager.setFontSize(size);
            this.fontModalVisible = false;
            uni.showToast({ title: "字体大小已更新", icon: "success", duration: 800 });
        },
        saveSettings() {
            uni.setStorageSync("userSettings", this.settings);
            uni.showToast({ title: "设置已保存", icon: "success", duration: 900 });
        },
        showPrivacy() {
            uni.showModal({
                title: "隐私政策",
                content: "擎思启学会使用你的学习画像、诊断记录和对话记录来提供个性化资源生成服务。请不要提交无关敏感信息。",
                showCancel: false,
                confirmText: "知道了",
            });
        },
        showTerms() {
            uni.showModal({
                title: "用户协议",
                content: "AI 生成内容用于学习辅助，重要结论请结合教材、课程要求和导师建议确认。",
                showCancel: false,
                confirmText: "知道了",
            });
        },
        confirmClearCache() {
            uni.showModal({
                title: "清空缓存",
                content: "确定要清空本地临时数据吗？",
                confirmColor: "#d64545",
                success: (res) => {
                    if (res.confirm) this.clearCache();
                },
            });
        },
        clearCache() {
            uni.clearStorageSync();
            uni.showToast({ title: "缓存已清空", icon: "success", duration: 1000 });
        },
    },
};
</script>

<style scoped lang="scss">
.settings-container {
    min-height: 100vh;
    background: linear-gradient(180deg, #f7fbff 0%, #eef6f2 58%, #fffaf0 100%);
    padding-bottom: 20rpx;
}

.settings-section {
    margin: 22rpx 30rpx;
    border-radius: 18rpx;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 10rpx 24rpx rgba(31, 55, 83, 0.1);
}

.section-title {
    padding: 20rpx 30rpx;
    font-size: 28rpx;
    font-weight: 800;
    color: #16324f;
    border-bottom: 1rpx solid #edf2f7;
}

.settings-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 30rpx;
    border-bottom: 1rpx solid #edf2f7;
}

.settings-item:last-child {
    border-bottom: none;
}

.item-left {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.item-label {
    font-size: 29rpx;
    color: #172b4d;
    font-weight: 700;
    margin-bottom: 8rpx;
}

.item-desc {
    font-size: 23rpx;
    color: #60758a;
    line-height: 1.4;
}

.menu-arrow {
    color: #8a9aab;
    font-size: 32rpx;
    margin-left: 20rpx;
}

.popup-container {
    background: #fff;
    border-radius: 18rpx 18rpx 0 0;
    padding: 30rpx 0;
}

.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30rpx 20rpx;
    border-bottom: 1rpx solid #edf2f7;
}

.popup-title {
    font-size: 32rpx;
    font-weight: 800;
    color: #16324f;
}

.close-btn {
    font-size: 38rpx;
    color: #60758a;
}

.font-options {
    display: flex;
    gap: 14rpx;
    padding: 22rpx !important;
}

.font-option {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 22rpx 16rpx;
    border: 2rpx solid #edf2f7;
    border-radius: 14rpx;
    background: #f8fafc;
}

.font-option.selected {
    border-color: #2f80ed;
    background: #edf5ff;
}

.font-preview {
    font-weight: 800;
    margin-bottom: 10rpx;
    color: #172b4d;
}

.font-preview.small { font-size: 32rpx; }
.font-preview.medium { font-size: 40rpx; }
.font-preview.large { font-size: 48rpx; }

.font-name {
    font-size: 23rpx;
    color: #536578;
}
</style>
