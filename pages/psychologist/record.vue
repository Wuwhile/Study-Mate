<template>
    <view class="record-container">
        <view class="record-list" v-if="!loading">
            <view v-if="records.length === 0" class="empty-state">
                <text class="empty-text">暂无预约记录</text>
                <text class="empty-desc">你还没有预约过学习导师</text>
            </view>

            <view v-for="record in records" :key="record.id" class="record-card" @click="viewRecordDetail(record)">
                <view class="card-header">
                    <view>
                        <text class="mentor-name">{{ record.doctorName }}</text>
                        <text class="appointment-time">{{ formatDate(record.createTime) }}</text>
                    </view>
                    <text class="status-text">{{ record.status || "待确认" }}</text>
                </view>

                <view class="card-content">
                    <text class="learner-name">{{ record.patientName }}</text>
                    <text class="learner-details">{{ record.patientAge }} · {{ record.patientGender }}</text>
                    <view class="need-content">
                        <text class="content-label">学习需求：</text>
                        <text class="content-text">{{ record.consultationContent }}</text>
                    </view>
                    <view class="appointment-details">
                        <text>紧急程度：{{ record.urgency }}</text>
                        <text>时间偏好：{{ record.timePreference }}</text>
                    </view>
                </view>

                <view class="card-footer">
                    <text class="phone-number">{{ record.patientPhone }}</text>
                    <button class="detail-btn" @click.stop="viewRecordDetail(record)">查看详情</button>
                </view>
            </view>
        </view>

        <view class="loading-container" v-if="loading">
            <view class="loading-spinner"></view>
            <text>加载预约记录中...</text>
        </view>

        <view class="detail-modal" v-if="showDetail" @click="closeDetail">
            <view class="detail-content" @click.stop>
                <view class="detail-header">
                    <text class="detail-title">学习规划预约详情</text>
                    <view class="close-btn" @click="closeDetail">
                        <uni-icons type="closeempty" size="26" color="#60758a" />
                    </view>
                </view>

                <scroll-view scroll-y class="detail-body">
                    <view class="detail-section">
                        <text class="section-label">导师信息</text>
                        <view class="info-row">
                            <text class="info-label">导师姓名</text>
                            <text class="info-value">{{ selectedRecord.doctorName }}</text>
                        </view>
                    </view>

                    <view class="detail-section">
                        <text class="section-label">学习者信息</text>
                        <view class="info-row">
                            <text class="info-label">姓名</text>
                            <text class="info-value">{{ selectedRecord.patientName }}</text>
                        </view>
                        <view class="info-row">
                            <text class="info-label">阶段</text>
                            <text class="info-value">{{ selectedRecord.patientAge }}</text>
                        </view>
                        <view class="info-row">
                            <text class="info-label">方向</text>
                            <text class="info-value">{{ selectedRecord.patientGender }}</text>
                        </view>
                        <view class="info-row">
                            <text class="info-label">手机号</text>
                            <text class="info-value">{{ selectedRecord.patientPhone }}</text>
                        </view>
                    </view>

                    <view class="detail-section">
                        <text class="section-label">预约信息</text>
                        <view class="info-row">
                            <text class="info-label">提交时间</text>
                            <text class="info-value">{{ formatDate(selectedRecord.createTime) }}</text>
                        </view>
                        <view class="info-row">
                            <text class="info-label">预约状态</text>
                            <text class="info-value">{{ selectedRecord.status || "待确认" }}</text>
                        </view>
                        <view class="info-row">
                            <text class="info-label">紧急程度</text>
                            <text class="info-value">{{ selectedRecord.urgency }}</text>
                        </view>
                        <view class="info-row">
                            <text class="info-label">时间偏好</text>
                            <text class="info-value">{{ selectedRecord.timePreference }}</text>
                        </view>
                    </view>

                    <view class="detail-section">
                        <text class="section-label">学习需求</text>
                        <text class="need-detail">{{ selectedRecord.consultationContent }}</text>
                    </view>
                </scroll-view>

                <view class="detail-footer">
                    <button class="detail-close-btn" @click="closeDetail">关闭</button>
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
            records: [],
            showDetail: false,
            selectedRecord: {},
        };
    },
    methods: {
        async loadAppointmentRecords() {
            try {
                this.loading = true;
                const result = await this.$api.appointment.getAppointmentList({ current: 1, size: 100 });
                if (result.code === 200) {
                    this.records = result.data || [];
                } else {
                    uni.showToast({ title: result.message || "加载失败", icon: "none" });
                }
            } catch (error) {
                uni.showToast({ title: "网络错误，请检查连接", icon: "none" });
            } finally {
                this.loading = false;
            }
        },
        formatDate(dateStr) {
            if (!dateStr) return "";
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        },
        viewRecordDetail(record) {
            this.selectedRecord = record;
            this.showDetail = true;
        },
        closeDetail() {
            this.showDetail = false;
            this.selectedRecord = {};
        },
    },
    onShow() {
        this.loadAppointmentRecords();
    },
};
</script>

<style lang="scss">
.record-container {
    min-height: 100vh;
    background: linear-gradient(180deg, #f7fbff 0%, #eef6f2 58%, #f7fbff 100%);
    padding-bottom: 40rpx;
}

.record-list {
    padding: 24rpx 30rpx;
}

.empty-state,
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 40rpx;
    color: #60758a;
}

.empty-text {
    font-size: 32rpx;
    font-weight: 800;
    color: #16324f;
    margin-bottom: 12rpx;
}

.record-card {
    background: rgba(255, 255, 255, 0.96);
    border-radius: 18rpx;
    padding: 28rpx;
    margin-bottom: 22rpx;
    box-shadow: 0 10rpx 24rpx rgba(31, 55, 83, 0.1);
}

.card-header,
.card-footer,
.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.mentor-name {
    display: block;
    font-size: 30rpx;
    font-weight: 800;
    color: #172b4d;
}

.appointment-time,
.learner-details,
.appointment-details,
.phone-number {
    font-size: 22rpx;
    color: #60758a;
}

.status-text {
    padding: 6rpx 14rpx;
    border-radius: 14rpx;
    background: #fff4d8;
    color: #946200;
    font-size: 20rpx;
    font-weight: 700;
}

.card-content {
    margin: 22rpx 0;
}

.learner-name {
    font-size: 26rpx;
    font-weight: 800;
    color: #172b4d;
    margin-right: 12rpx;
}

.need-content {
    margin: 16rpx 0;
}

.content-label,
.content-text {
    font-size: 24rpx;
    color: #536578;
    line-height: 1.55;
}

.appointment-details {
    display: flex;
    gap: 20rpx;
    flex-wrap: wrap;
}

.detail-btn,
.detail-close-btn {
    background: #2f80ed;
    color: #fff;
    border-radius: 16rpx;
    font-size: 24rpx;
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
    max-width: 620rpx;
    max-height: 86vh;
    background: #fff;
    border-radius: 20rpx;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

.detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx;
    border-bottom: 1rpx solid #e8eef5;
    gap: 18rpx;
}

.detail-title {
    flex: 1;
    min-width: 0;
    font-size: 31rpx;
    font-weight: 800;
    color: #172b4d;
    line-height: 1.4;
    word-break: break-word;
}

.close-btn {
    flex: 0 0 52rpx;
    width: 52rpx;
    height: 52rpx;
    border-radius: 50%;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
}

.detail-body {
    box-sizing: border-box;
    width: 100%;
    padding: 30rpx 40rpx;
    max-height: 58vh;
    overflow-x: hidden;
}

.detail-section {
    margin-bottom: 28rpx;
}

.section-label {
    display: block;
    font-size: 26rpx;
    color: #16324f;
    font-weight: 800;
    margin-bottom: 12rpx;
}

.info-row {
    margin-bottom: 10rpx;
    align-items: flex-start;
    gap: 20rpx;
}

.info-label {
    flex: 0 0 150rpx;
    font-size: 24rpx;
    color: #8a9aab;
}

.info-value {
    flex: 1;
    min-width: 0;
    font-size: 24rpx;
    color: #172b4d;
    text-align: right;
    line-height: 1.5;
    word-break: break-word;
    overflow-wrap: break-word;
}

.need-detail {
    display: block;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    padding: 18rpx;
    border-radius: 14rpx;
    background: #f8fafc;
    font-size: 25rpx;
    color: #536578;
    line-height: 1.7;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;
}

.detail-footer {
    padding: 22rpx 32rpx 32rpx;
}
</style>
