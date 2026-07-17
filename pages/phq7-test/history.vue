<template>
    <view class="history-page">
        <view v-if="loading" class="empty-state">
            <text>加载诊断报告中...</text>
        </view>

        <view v-else-if="records.length === 0" class="empty-state">
            <text class="empty-title">暂无诊断报告</text>
            <text class="empty-desc">完成一次学习画像诊断后，报告会显示在这里。</text>
        </view>

        <view v-else class="record-list">
            <view v-for="record in records" :key="record.id" class="record-card">
                <view class="card-header">
                    <text class="record-title">{{ normalizeName(record.questionnaireName) }}</text>
                    <text class="record-score">{{ record.score }} 分</text>
                </view>
                <text class="record-level">{{ record.depressionLevel || "学习画像报告" }}</text>
                <text class="record-desc">{{ record.levelDescription }}</text>
                <text class="record-time">{{ formatDate(record.createTime || record.createdAt) }}</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            loading: true,
            records: [],
        };
    },
    methods: {
        async loadRecords() {
            try {
                this.loading = true;
                const userId = uni.getStorageSync("userId");
                const result = await this.$api.questionnaire.getUserResults(userId);
                if (result.code === 200) {
                    this.records = result.data || [];
                } else {
                    uni.showToast({ title: result.message || "加载失败", icon: "none" });
                }
            } catch (error) {
                uni.showToast({ title: "加载失败", icon: "none" });
            } finally {
                this.loading = false;
            }
        },
        normalizeName(name) {
            return name || "Study-mate 学习画像诊断";
        },
        formatDate(dateStr) {
            if (!dateStr) return "";
            return new Date(dateStr).toLocaleString("zh-CN");
        },
    },
    onShow() {
        this.loadRecords();
    },
};
</script>

<style lang="scss">
.history-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #f7fbff 0%, #eef6f2 58%, #f7fbff 100%);
    padding: 28rpx;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    text-align: center;
    color: #60758a;
}

.empty-title {
    font-size: 32rpx;
    font-weight: 800;
    color: #16324f;
    margin-bottom: 12rpx;
}

.empty-desc {
    font-size: 24rpx;
}

.record-card {
    background: rgba(255, 255, 255, 0.96);
    border-radius: 18rpx;
    padding: 28rpx;
    margin-bottom: 22rpx;
    box-shadow: 0 10rpx 24rpx rgba(31, 55, 83, 0.1);
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14rpx;
}

.record-title {
    font-size: 29rpx;
    font-weight: 800;
    color: #172b4d;
}

.record-score {
    font-size: 28rpx;
    font-weight: 900;
    color: #2f80ed;
}

.record-level {
    display: block;
    font-size: 25rpx;
    color: #16324f;
    font-weight: 800;
    margin-bottom: 10rpx;
}

.record-desc {
    display: block;
    font-size: 24rpx;
    color: #536578;
    line-height: 1.65;
}

.record-time {
    display: block;
    margin-top: 14rpx;
    font-size: 21rpx;
    color: #8a9aab;
}
</style>
