<template>
    <view class="appointment-container">
        <view class="mentor-card">
            <image :src="mentorInfo.avatar" class="mentor-avatar" mode="aspectFill" />
            <view class="mentor-details">
                <text class="mentor-name">{{ mentorInfo.name }}</text>
                <text class="mentor-title">{{ mentorInfo.title }}</text>
                <text class="mentor-specialties">{{ mentorInfo.specialties.join("、") }}</text>
            </view>
        </view>

        <view class="form-container">
            <view class="form-title">
                <text class="title-text">填写学习规划预约</text>
                <text class="title-desc">提交后，导师会根据你的目标与基础确认辅导方案。</text>
            </view>

            <view class="form-item">
                <text class="form-label">姓名 <text class="required">*</text></text>
                <input class="form-input" v-model="formData.name" placeholder="请输入姓名" maxlength="20" />
            </view>

            <view class="form-item">
                <text class="form-label">年级/阶段 <text class="required">*</text></text>
                <input class="form-input" v-model="formData.age" placeholder="例如：大三、研一、在职学习" maxlength="20" />
            </view>

            <view class="form-item">
                <text class="form-label">学习方向 <text class="required">*</text></text>
                <view class="option-row">
                    <view class="option" :class="{ selected: formData.gender === '课程学习' }" @click="selectGender('课程学习')">课程学习</view>
                    <view class="option" :class="{ selected: formData.gender === '项目实践' }" @click="selectGender('项目实践')">项目实践</view>
                </view>
            </view>

            <view class="form-item">
                <text class="form-label">手机号 <text class="required">*</text></text>
                <input class="form-input" v-model="formData.phone" placeholder="请输入手机号" type="number" maxlength="11" />
            </view>

            <view class="form-item">
                <text class="form-label">学习需求 <text class="required">*</text></text>
                <textarea
                    class="form-textarea"
                    v-model="formData.content"
                    placeholder="请描述课程、目标、当前困难、希望生成的资源或需要导师帮助的地方"
                    maxlength="500"
                    :show-count="true"
                />
            </view>

            <view class="form-item">
                <text class="form-label">紧急程度</text>
                <view class="option-row">
                    <view class="option" :class="{ selected: formData.urgency === '普通' }" @click="selectUrgency('普通')">普通</view>
                    <view class="option" :class="{ selected: formData.urgency === '近期需要' }" @click="selectUrgency('近期需要')">近期需要</view>
                    <view class="option" :class="{ selected: formData.urgency === '考前冲刺' }" @click="selectUrgency('考前冲刺')">考前冲刺</view>
                </view>
            </view>

            <view class="form-item">
                <text class="form-label">时间偏好</text>
                <view class="option-row">
                    <view class="option" :class="{ selected: formData.timePreference === '工作日' }" @click="selectTimePreference('工作日')">工作日</view>
                    <view class="option" :class="{ selected: formData.timePreference === '周末' }" @click="selectTimePreference('周末')">周末</view>
                    <view class="option" :class="{ selected: formData.timePreference === '均可' }" @click="selectTimePreference('均可')">均可</view>
                </view>
            </view>

            <view class="submit-section">
                <button class="submit-btn" :class="{ disabled: !isFormValid }" :disabled="!isFormValid" @click="submitAppointment">
                    提交预约申请
                </button>
                <text class="submit-tip">提交后会在 24 小时内确认学习规划时间</text>
            </view>
        </view>

        <view class="success-modal" v-if="showSuccess" @click="closeSuccess">
            <view class="success-content" @click.stop>
                <view class="success-icon">✓</view>
                <text class="success-title">预约已提交</text>
                <text class="success-message">我们已收到你的学习规划需求，导师确认后会给出下一步学习建议。</text>
                <button class="success-btn" @click="closeSuccess">确定</button>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            showSuccess: false,
            formData: {
                name: "",
                age: "",
                gender: "",
                phone: "",
                content: "",
                urgency: "普通",
                timePreference: "均可",
            },
            mentorInfo: {
                id: 1,
                name: "林知远",
                title: "学习规划导师",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mentor1&backgroundColor=b6e3f4",
                specialties: ["学习路径规划", "Python 入门", "错题复盘"],
            },
        };
    },
    computed: {
        isFormValid() {
            return (
                this.formData.name.trim() &&
                this.formData.age.trim() &&
                this.formData.gender &&
                this.formData.phone.trim() &&
                this.formData.content.trim()
            );
        },
    },
    methods: {
        selectGender(value) {
            this.formData.gender = value;
        },
        selectUrgency(value) {
            this.formData.urgency = value;
        },
        selectTimePreference(value) {
            this.formData.timePreference = value;
        },
        validatePhone(phone) {
            return /^1[3-9]\d{9}$/.test(phone);
        },
        async submitAppointment() {
            if (!this.isFormValid) {
                uni.showToast({ title: "请填写完整信息", icon: "none" });
                return;
            }
            if (!this.validatePhone(this.formData.phone)) {
                uni.showToast({ title: "请输入正确的手机号", icon: "none" });
                return;
            }

            try {
                uni.showLoading({ title: "提交中..." });
                await this.saveAppointmentToBackend();
                uni.hideLoading();
                this.showSuccess = true;
            } catch (error) {
                uni.hideLoading();
                uni.showToast({ title: "提交失败，请重试", icon: "none" });
            }
        },
        async saveAppointmentToBackend() {
            const appointmentData = {
                doctorId: this.mentorInfo.id,
                doctorName: this.mentorInfo.name,
                patientName: this.formData.name,
                patientAge: parseInt(this.formData.age) || 0,
                patientGender: this.formData.gender,
                patientPhone: this.formData.phone,
                consultationContent: this.formData.content,
                urgency: this.formData.urgency,
                timePreference: this.formData.timePreference,
            };
            const result = await this.$api.appointment.saveAppointment(appointmentData);
            if (result.code !== 200) {
                throw new Error(result.message || "保存失败");
            }
        },
        closeSuccess() {
            this.showSuccess = false;
            setTimeout(() => uni.navigateBack(), 500);
        },
    },
    onLoad(options) {
        if (options.doctorId) {
            this.mentorInfo = {
                id: options.doctorId,
                name: decodeURIComponent(options.doctorName || ""),
                title: decodeURIComponent(options.doctorTitle || ""),
                avatar: decodeURIComponent(options.doctorAvatar || ""),
                specialties: options.doctorSpecialties ? decodeURIComponent(options.doctorSpecialties).split(",") : [],
            };
        }
    },
};
</script>

<style lang="scss">
.appointment-container {
    min-height: 100vh;
    background: linear-gradient(180deg, #f7fbff 0%, #eef6f2 58%, #fffaf0 100%);
    padding: 24rpx 30rpx 44rpx;
}

.mentor-card,
.form-container {
    background: rgba(255, 255, 255, 0.96);
    border-radius: 20rpx;
    box-shadow: 0 10rpx 24rpx rgba(31, 55, 83, 0.1);
}

.mentor-card {
    display: flex;
    align-items: center;
    padding: 28rpx;
    margin-bottom: 22rpx;
}

.mentor-avatar {
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    margin-right: 20rpx;
}

.mentor-name {
    display: block;
    font-size: 31rpx;
    font-weight: 800;
    color: #172b4d;
}

.mentor-title,
.mentor-specialties {
    display: block;
    margin-top: 6rpx;
    font-size: 22rpx;
    color: #60758a;
}

.form-container {
    padding: 36rpx;
}

.form-title {
    text-align: center;
    margin-bottom: 34rpx;
}

.title-text {
    display: block;
    font-size: 34rpx;
    font-weight: 800;
    color: #16324f;
}

.title-desc {
    display: block;
    margin-top: 10rpx;
    font-size: 24rpx;
    color: #60758a;
    line-height: 1.5;
}

.form-item {
    margin-bottom: 28rpx;
}

.form-label {
    display: block;
    margin-bottom: 12rpx;
    font-size: 27rpx;
    font-weight: 700;
    color: #172b4d;
}

.required {
    color: #d64545;
}

.form-input,
.form-textarea {
    width: 100%;
    box-sizing: border-box;
    background: #f8fafc;
    border: 2rpx solid #e3ebf3;
    border-radius: 14rpx;
    padding: 0 20rpx;
    font-size: 27rpx;
    color: #172b4d;
}

.form-input {
    height: 78rpx;
}

.form-textarea {
    min-height: 150rpx;
    padding: 18rpx 20rpx;
}

.option-row {
    display: flex;
    gap: 14rpx;
}

.option {
    flex: 1;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    border: 2rpx solid #e3ebf3;
    border-radius: 14rpx;
    font-size: 24rpx;
    color: #60758a;
}

.option.selected {
    background: #2f80ed;
    border-color: #2f80ed;
    color: #fff;
    font-weight: 800;
}

.submit-section {
    margin-top: 36rpx;
    text-align: center;
}

.submit-btn {
    background: #2f80ed;
    color: #fff;
    border-radius: 18rpx;
    font-weight: 800;
}

.submit-btn.disabled {
    background: #cbd5e1;
}

.submit-tip {
    display: block;
    margin-top: 14rpx;
    font-size: 22rpx;
    color: #8a9aab;
}

.success-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 40rpx;
}

.success-content {
    width: 100%;
    max-width: 500rpx;
    padding: 54rpx 38rpx 38rpx;
    text-align: center;
    background: #fff;
    border-radius: 20rpx;
}

.success-icon {
    font-size: 72rpx;
    color: #18a058;
}

.success-title {
    display: block;
    font-size: 32rpx;
    font-weight: 800;
    margin: 12rpx 0;
}

.success-message {
    display: block;
    font-size: 25rpx;
    color: #536578;
    line-height: 1.6;
    margin-bottom: 28rpx;
}

.success-btn {
    background: #2f80ed;
    color: #fff;
    border-radius: 16rpx;
}
</style>
