const http = uni.$u.http;

const api = {
    login(params) {
        return http.post("/login", params, { custom: { auth: false, catch: true, toast: false } });
    },
    register(params) {
        return http.post("/register", params, { custom: { auth: false, catch: true, toast: false } });
    },
    message(params) {
        return http.post("/message", params, { custom: { auth: true } });
    },
    messagePage(params) {
        return http.get("/message", { params });
    },
    createConversation(data) {
        return http.post("/conversation", data, { custom: { auth: true } });
    },
    getConversationList(params) {
        return http.get("/conversation", { params });
    },
    getConversationDetail(id, params) {
        return http.get(`/conversation/${id}`, { params });
    },
    deleteConversation(id) {
        return http.delete(`/conversation/${id}`, { custom: { auth: true } });
    },
    updateConversation(id, data) {
        return http.put(`/conversation/${id}`, data, { custom: { auth: true } });
    },
    generateConversationTitle(id) {
        return http.post(`/conversation/${id}/generate-title`, {}, { custom: { auth: true } });
    },
    questionnaire: {
        saveResult(data) {
            return http.post("/questionnaireResults/savePhq9Result", data);
        },
        getUserResults(userId) {
            return http.get(`/questionnaireResults/listByUserId/${userId}`);
        },
        getLatestResult(userId) {
            return http.get(`/questionnaireResults/latestByUserId/${userId}`);
        },
        getResultDetail(id) {
            return http.get(`/questionnaireResults/${id}`);
        },
        deleteResult(id) {
            return http.delete(`/questionnaireResults/${id}`);
        },
        batchDeleteResult(ids) {
            return http.delete("/questionnaireResults/batch", { data: ids });
        },
        getResultCount(params) {
            return http.get("/questionnaireResults/count", { params });
        },
    },
    appointment: {
        saveAppointment(data) {
            return http.post("/appointment/saveAppointment", data);
        },
        getAppointmentList(params) {
            return http.get("/appointment/list", { params });
        },
        getAppointmentByDoctorId(doctorId) {
            return http.get(`/appointment/listByDoctorId/${doctorId}`);
        },
        getAppointmentByPatientPhone(patientPhone) {
            return http.get(`/appointment/listByPatientPhone/${patientPhone}`);
        },
        getAppointmentDetail(id) {
            return http.get(`/appointment/${id}`);
        },
        updateAppointment(data) {
            return http.put("/appointment", data);
        },
        deleteAppointment(id) {
            return http.delete(`/appointment/${id}`);
        },
        batchDeleteAppointment(ids) {
            return http.delete("/appointment/batch", { data: ids });
        },
        getAppointmentCount(params) {
            return http.get("/appointment/count", { params });
        },
    },
    user: {
        getInfo() {
            return http.get("/user/info");
        },
        updateInfo(data) {
            return http.put("/user/info", data);
        },
    },
    account: {
        getAccountInfo() {
            return http.get("/user/account");
        },
        updateAccountInfo(data) {
            return http.put("/user/info", data);
        },
        updateEmail(data) {
            return http.put("/user/email", data);
        },
        sendEmailCode(email) {
            return http.post("/user/email/code", { email });
        },
        verifyEmail(data) {
            return http.post("/user/email/verify", data);
        },
        updatePhone(data) {
            return http.put("/user/phone", data);
        },
        sendPhoneCode(phone) {
            return http.post("/user/phone/code", { phone });
        },
        verifyPhone(data) {
            return http.post("/user/phone/verify", data);
        },
        changePassword(data) {
            return http.post("/user/password/change", data);
        },
        getDeviceList() {
            return http.get("/user/devices");
        },
        logoutDevice(deviceId) {
            return http.post(`/user/devices/${deviceId}/logout`);
        },
        getLoginHistory(params) {
            return http.get("/user/login-history", { params });
        },
        bindWechat(data) {
            return http.post("/user/wechat/bind", data);
        },
        unbindWechat() {
            return http.post("/user/wechat/unbind");
        },
        bindQQ(data) {
            return http.post("/user/qq/bind", data);
        },
        unbindQQ() {
            return http.post("/user/qq/unbind");
        },
        getSecurityStatus() {
            return http.get("/user/security-status");
        },
        getLoginLogs(params) {
            return http.get("/user/login-logs", { params });
        },
        getLatestLoginLogs(params) {
            return http.get("/user/login-logs/latest", { params });
        },
        deleteLoginLog(logId) {
            return http.post("/user/login-logs/delete", { logId });
        },
        clearLoginLogs() {
            return http.post("/user/login-logs/clear");
        },
        sendResetPasswordCode(data) {
            return http.post("/user/password/reset-code", data, { custom: { auth: false, catch: true, toast: false } });
        },
        resetPassword(data) {
            return http.post("/user/password/reset", data, { custom: { auth: false, catch: true, toast: false } });
        },
        uploadAvatar(avatar) {
            return http.post("/user/avatar", { avatar });
        },
    },
};

export default api;
