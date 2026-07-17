<template>
    <view class="diagnosis-page">
        <view v-if="!showResult" class="question-card">
            <view class="test-header">
                <text class="test-title">{{ currentDiagnosis.title }}</text>
                <text class="test-subtitle">{{ currentDiagnosis.subtitle }}</text>
            </view>

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
            <text class="result-title">{{ currentDiagnosis.title }}报告</text>
            <view class="score-block">
                <text class="score">{{ totalScore }}</text>
                <text class="score-label">{{ currentDiagnosis.scoreLabel }}</text>
            </view>
            <view class="result-section">
                <text class="section-title">{{ result.level }}</text>
                <text class="section-text">{{ result.description }}</text>
            </view>
            <view class="result-section">
                <text class="section-title">推荐生成资源</text>
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
const confidenceOptions = [
    { label: "几乎没有", desc: "需要从概念和示例重新建立基础", value: 1 },
    { label: "有一点", desc: "看提示能理解，但独立完成还不稳定", value: 2 },
    { label: "比较稳定", desc: "常规任务可以完成，偶尔需要校准", value: 3 },
    { label: "很稳定", desc: "能解释思路，并迁移到相近问题", value: 4 },
];

const frequencyOptions = [
    { label: "很少做到", desc: "目前还没有形成稳定习惯", value: 1 },
    { label: "偶尔做到", desc: "依赖提醒或临近截止才会执行", value: 2 },
    { label: "经常做到", desc: "大多数学习场景下能主动执行", value: 3 },
    { label: "一直做到", desc: "已经形成清晰方法，并能持续复盘", value: 4 },
];

const clarityOptions = [
    { label: "不清楚", desc: "还停留在大概想学的阶段", value: 1 },
    { label: "有方向", desc: "知道主题，但缺少可执行拆分", value: 2 },
    { label: "较明确", desc: "有任务、时间或验收要求", value: 3 },
    { label: "非常明确", desc: "知道目标、标准、路径和反馈方式", value: 4 },
];

const DIAGNOSIS_BANK = {
    foundation: {
        title: "课程基础诊断",
        subtitle: "判断先修知识、核心概念和基础题的掌握情况",
        scoreLabel: "基础掌握度",
        questions: [
            {
                text: "你对当前课程/章节的核心概念掌握得如何？",
                tip: "例如定义、公式、关键术语、适用条件。",
                options: confidenceOptions,
            },
            {
                text: "看到一道基础题时，你能判断它考察哪个知识点吗？",
                tip: "这会影响系统是否先生成知识点讲义。",
                options: confidenceOptions,
            },
            {
                text: "你是否能说清楚最近一次错题错在哪里？",
                tip: "包括概念不清、步骤跳跃、计算错误或题意误读。",
                options: frequencyOptions,
            },
            {
                text: "遇到新例题时，你能否独立复现解题步骤？",
                tip: "不用完全记住答案，重点是能推导流程。",
                options: confidenceOptions,
            },
            {
                text: "你对本课程的先修知识是否有明显断点？",
                tip: "选择越高表示断点越少，基础越连贯。",
                options: [
                    { label: "断点很多", desc: "需要先补先修概念", value: 1 },
                    { label: "有几个断点", desc: "需要局部补齐", value: 2 },
                    { label: "基本连贯", desc: "少量概念需要回看", value: 3 },
                    { label: "非常连贯", desc: "可以直接进入综合训练", value: 4 },
                ],
            },
            {
                text: "你能把一个知识点用自己的话讲给别人听吗？",
                tip: "能讲清楚通常说明已经从记忆进入理解。",
                options: confidenceOptions,
            },
            {
                text: "你目前的课堂笔记或资料是否能支持复习？",
                tip: "系统会据此判断是否生成整理版讲义。",
                options: [
                    { label: "资料混乱", desc: "笔记缺失或难以查找", value: 1 },
                    { label: "有但零散", desc: "需要系统帮忙重组", value: 2 },
                    { label: "基本可用", desc: "可以配合错题继续学习", value: 3 },
                    { label: "结构清晰", desc: "适合直接生成进阶练习", value: 4 },
                ],
            },
            {
                text: "完成基础练习后，你会主动总结同类题规律吗？",
                tip: "这会影响后续是否生成归纳卡片。",
                options: frequencyOptions,
            },
            {
                text: "如果现在进行一次小测，你预计基础题完成度如何？",
                tip: "按真实状态选择，报告会更准确。",
                options: [
                    { label: "低于 40%", desc: "需要系统从入门讲解开始", value: 1 },
                    { label: "40%-60%", desc: "需要讲义和基础例题配合", value: 2 },
                    { label: "60%-85%", desc: "适合薄弱点专项训练", value: 3 },
                    { label: "85% 以上", desc: "可以进入迁移和综合题", value: 4 },
                ],
            },
        ],
        levels: [
            {
                maxRatio: 0.45,
                level: "基础补齐型",
                description: "当前更需要先建立概念框架和先修知识连接，直接做综合题容易消耗精力。",
                resources: "生成入门讲义、术语卡片、基础例题拆解和先修知识补丁。",
                nextStep: "先选择 2-3 个最薄弱知识点，让 AI 学习助手生成短讲义和配套小题。",
            },
            {
                maxRatio: 0.72,
                level: "稳步提升型",
                description: "你已经有一定基础，但概念迁移和错题归因还需要更系统的训练。",
                resources: "生成分层例题、错因归纳表、知识点对比卡和每周复习计划。",
                nextStep: "从最近错题最多的知识点开始，完成一组由浅入深的 5 道题。",
            },
            {
                maxRatio: 1,
                level: "迁移应用型",
                description: "基础较稳，可以更多进入综合任务、限时训练和跨知识点迁移。",
                resources: "生成综合练习、项目任务、验收清单和高频易错提醒。",
                nextStep: "让系统生成一个小项目或综合题组，用输出结果检验掌握深度。",
            },
        ],
    },
    knowledge: {
        title: "知识点掌握诊断",
        subtitle: "定位薄弱知识点、错因类型和讲解粒度",
        scoreLabel: "知识点清晰度",
        questions: [
            {
                text: "你能列出当前单元最重要的 3-5 个知识点吗？",
                tip: "不能列出时，系统会优先生成知识地图。",
                options: clarityOptions,
            },
            {
                text: "你能区分相似概念之间的差异吗？",
                tip: "例如适用条件、边界情况和常见误用。",
                options: confidenceOptions,
            },
            {
                text: "做题时，你是否知道每一步用到了哪个知识点？",
                tip: "这决定是否需要生成逐步标注版解析。",
                options: frequencyOptions,
            },
            {
                text: "你是否有持续记录错题对应知识点？",
                tip: "系统可以据此生成薄弱点列表。",
                options: frequencyOptions,
            },
            {
                text: "你更容易在哪类问题上卡住？",
                tip: "选择越高代表卡点越靠近高阶应用。",
                options: [
                    { label: "概念定义", desc: "不确定术语和基础含义", value: 1 },
                    { label: "公式/规则选择", desc: "不知道该用哪个方法", value: 2 },
                    { label: "步骤执行", desc: "知道方法但容易算错或漏步", value: 3 },
                    { label: "综合迁移", desc: "基础会，但复杂场景需要训练", value: 4 },
                ],
            },
            {
                text: "学习一个新知识点后，你会主动做变式题吗？",
                tip: "变式训练能提升迁移能力。",
                options: frequencyOptions,
            },
            {
                text: "你希望 AI 对知识点解释到什么程度？",
                tip: "这会影响生成资源的讲解粒度。",
                options: [
                    { label: "从零讲起", desc: "先解释背景和术语", value: 1 },
                    { label: "配例题讲", desc: "用样题串起方法", value: 2 },
                    { label: "指出易错点", desc: "重点补漏洞和边界", value: 3 },
                    { label: "给挑战题", desc: "用难题检验迁移", value: 4 },
                ],
            },
        ],
        levels: [
            {
                maxRatio: 0.45,
                level: "知识地图缺失",
                description: "当前主要问题是知识结构不够清楚，需要先知道学什么、怎么连起来。",
                resources: "生成章节知识地图、概念解释卡、最小必会清单和基础例题。",
                nextStep: "先让 AI 生成一张知识点树，再从最底层概念开始补齐。",
            },
            {
                maxRatio: 0.72,
                level: "薄弱点可定位",
                description: "你已经能识别部分知识点，但还需要把错题和知识点稳定对应起来。",
                resources: "生成错题-知识点映射表、相似概念对比、变式题和错因标签。",
                nextStep: "选择一个高频错因，让系统生成 3 道同类变式题做巩固。",
            },
            {
                maxRatio: 1,
                level: "知识网络成形",
                description: "知识点掌握较清晰，可以用跨章节任务检验连接和迁移。",
                resources: "生成综合题组、知识迁移挑战、讲解脚本和自测清单。",
                nextStep: "让 AI 把多个知识点组合成一个项目或综合案例。",
            },
        ],
    },
    goal: {
        title: "学习目标清晰度诊断",
        subtitle: "拆解考试、作业、项目或能力提升目标",
        scoreLabel: "目标清晰度",
        questions: [
            {
                text: "你现在最主要的学习目标是什么？",
                tip: "目标越具体，资源生成越精准。",
                options: [
                    { label: "还没想清楚", desc: "只是觉得需要学习", value: 1 },
                    { label: "知道方向", desc: "有课程或主题范围", value: 2 },
                    { label: "有具体任务", desc: "面向考试、作业或项目", value: 3 },
                    { label: "有验收标准", desc: "知道完成到什么程度算达标", value: 4 },
                ],
            },
            {
                text: "你是否知道目标的截止时间或阶段节点？",
                tip: "计划智能体会据此拆分任务。",
                options: clarityOptions,
            },
            {
                text: "你能把大目标拆成每周可完成的小任务吗？",
                tip: "不能拆分时，系统会先生成路线图。",
                options: confidenceOptions,
            },
            {
                text: "你是否清楚老师/考试/项目对成果的评价标准？",
                tip: "这会影响验收清单和训练题生成。",
                options: clarityOptions,
            },
            {
                text: "当目标变化时，你会调整学习计划吗？",
                tip: "计划更新能力决定后续推荐是否动态调整。",
                options: frequencyOptions,
            },
            {
                text: "你对目标达成的优先级是否清楚？",
                tip: "例如先保分、再拔高，或先完成项目再优化表达。",
                options: clarityOptions,
            },
            {
                text: "你希望系统如何帮助你验收目标？",
                tip: "选择越高代表验收越接近真实交付。",
                options: [
                    { label: "提醒我学过", desc: "提供学习记录和打卡", value: 1 },
                    { label: "给我小测", desc: "用题目检查掌握", value: 2 },
                    { label: "检查作品", desc: "对作业/代码/报告给反馈", value: 3 },
                    { label: "模拟真实场景", desc: "用考试或项目标准验收", value: 4 },
                ],
            },
            {
                text: "你是否愿意为目标建立固定复盘周期？",
                tip: "复盘能让计划不断贴近真实进度。",
                options: frequencyOptions,
            },
        ],
        levels: [
            {
                maxRatio: 0.45,
                level: "目标探索型",
                description: "当前目标还偏抽象，需要先明确学习对象、截止时间和成功标准。",
                resources: "生成目标澄清问卷、能力清单、学习路线草案和样例成果。",
                nextStep: "先回答“我要在什么时间完成什么成果”，再让系统拆成阶段目标。",
            },
            {
                maxRatio: 0.72,
                level: "目标拆解型",
                description: "你已有明确方向，但需要把目标拆成可执行任务和可验收标准。",
                resources: "生成阶段路线图、周任务表、验收清单和里程碑提醒。",
                nextStep: "把最近 7 天的任务交给计划智能体，生成每日学习安排。",
            },
            {
                maxRatio: 1,
                level: "目标驱动型",
                description: "目标清晰度较高，可以围绕成果质量和反馈迭代来提升效率。",
                resources: "生成模拟测评、项目评审标准、冲刺计划和成果优化建议。",
                nextStep: "选择一个真实交付物，让 AI 按评价标准进行一次反馈。",
            },
        ],
    },
    collaboration: {
        title: "协作学习需求诊断",
        subtitle: "判断是否需要导师指导、同伴互评或项目协作",
        scoreLabel: "协作成熟度",
        questions: [
            {
                text: "遇到难题时，你会主动描述问题并寻求帮助吗？",
                tip: "问题描述越清楚，智能体协作越高效。",
                options: frequencyOptions,
            },
            {
                text: "你是否能把自己的思路讲给同伴或导师听？",
                tip: "这决定是否适合同伴互评和讲题训练。",
                options: confidenceOptions,
            },
            {
                text: "你是否需要导师帮你判断学习优先级？",
                tip: "选择越高代表越能自主判断。",
                options: [
                    { label: "非常需要", desc: "经常不知道先学什么", value: 1 },
                    { label: "有时需要", desc: "任务多时容易混乱", value: 2 },
                    { label: "基本能判断", desc: "只需要关键节点确认", value: 3 },
                    { label: "能自主规划", desc: "更需要高质量反馈", value: 4 },
                ],
            },
            {
                text: "参与项目或小组作业时，你是否能承担明确角色？",
                tip: "角色清晰有助于生成协作任务清单。",
                options: frequencyOptions,
            },
            {
                text: "你是否愿意让 AI 或同伴检查你的作业/代码/报告？",
                tip: "开放反馈会提高迭代速度。",
                options: frequencyOptions,
            },
            {
                text: "收到反馈后，你会主动修改并记录改进点吗？",
                tip: "这决定是否适合周复盘和导师跟进。",
                options: frequencyOptions,
            },
        ],
        levels: [
            {
                maxRatio: 0.45,
                level: "高引导需求",
                description: "你更需要明确的导师式引导，先解决问题描述、优先级和任务拆分。",
                resources: "生成提问模板、导师问诊清单、任务优先级表和基础反馈表。",
                nextStep: "把当前卡住的问题按“背景-尝试-卡点”格式发给 AI 学习助手。",
            },
            {
                maxRatio: 0.72,
                level: "协作推进型",
                description: "你已经能进行基础协作，适合引入同伴互评和阶段性导师反馈。",
                resources: "生成小组分工表、互评标准、讨论提纲和阶段复盘记录。",
                nextStep: "选择一个正在做的任务，让系统生成协作分工和验收标准。",
            },
            {
                maxRatio: 1,
                level: "反馈迭代型",
                description: "你能较好利用外部反馈，适合用项目评审和高阶挑战推动成长。",
                resources: "生成项目评审表、答辩问题、代码/报告审阅清单和改进路线。",
                nextStep: "提交一份学习成果，让 AI 以导师视角给出评审意见。",
            },
        ],
    },
    schedule: {
        title: "每周学习时间诊断",
        subtitle: "评估可用时间、专注时段和任务承载量",
        scoreLabel: "时间可执行度",
        questions: [
            {
                text: "你每周能稳定投入多少学习时间？",
                tip: "计划智能体会控制任务量，避免过载。",
                options: [
                    { label: "少于 3 小时", desc: "适合碎片化卡片和短练习", value: 1 },
                    { label: "3-6 小时", desc: "适合小节推进和轻量练习", value: 2 },
                    { label: "6-10 小时", desc: "可以安排专项训练和复盘", value: 3 },
                    { label: "10 小时以上", desc: "适合项目任务和冲刺计划", value: 4 },
                ],
            },
            {
                text: "你是否有固定的高专注学习时段？",
                tip: "例如晚上 8-10 点或周末上午。",
                options: clarityOptions,
            },
            {
                text: "你是否会提前安排预习、练习和复盘？",
                tip: "完整闭环比单纯刷题更稳定。",
                options: frequencyOptions,
            },
            {
                text: "计划被打断后，你能否重新调整任务？",
                tip: "这决定系统是否需要提供补救计划。",
                options: confidenceOptions,
            },
            {
                text: "你是否会低估学习任务所需时间？",
                tip: "选择越高代表估时越准确。",
                options: [
                    { label: "经常低估", desc: "计划常常完不成", value: 1 },
                    { label: "偶尔低估", desc: "复杂任务容易超时", value: 2 },
                    { label: "基本准确", desc: "能留出一定缓冲", value: 3 },
                    { label: "估时成熟", desc: "能按难度动态调整", value: 4 },
                ],
            },
            {
                text: "你是否愿意每天完成一个很小的学习任务？",
                tip: "微任务能帮助保持连续性。",
                options: frequencyOptions,
            },
        ],
        levels: [
            {
                maxRatio: 0.45,
                level: "碎片时间型",
                description: "当前学习时间较分散，适合先用低负担任务建立连续性。",
                resources: "生成 10 分钟知识卡、微练习、每日提醒和补救计划。",
                nextStep: "先安排连续 3 天的最小任务，每天只完成一个知识卡或一道小题。",
            },
            {
                maxRatio: 0.72,
                level: "稳定推进型",
                description: "你有一定可用时间，可以按周推进知识点、练习和复盘。",
                resources: "生成周计划、分层练习、错题复盘表和阶段小测。",
                nextStep: "让计划智能体按你的空闲时间生成一份 7 天任务表。",
            },
            {
                maxRatio: 1,
                level: "冲刺规划型",
                description: "时间承载量较好，可以加入项目、模拟考试或阶段验收。",
                resources: "生成冲刺计划、限时训练、项目里程碑和复盘仪表盘。",
                nextStep: "选择一个明确目标，让系统生成两周冲刺计划。",
            },
        ],
    },
    review: {
        title: "复习节奏诊断",
        subtitle: "定位预习、练习、复盘、测试之间的时间分配",
        scoreLabel: "复习闭环度",
        questions: [
            {
                text: "学习新内容后，你会在 24 小时内复习吗？",
                tip: "及时复习能显著降低遗忘。",
                options: frequencyOptions,
            },
            {
                text: "你是否会定期回看错题和薄弱点？",
                tip: "系统可以生成滚动复习提醒。",
                options: frequencyOptions,
            },
            {
                text: "你是否区分预习、练习、复盘和测试的时间？",
                tip: "不同环节需要不同资源。",
                options: clarityOptions,
            },
            {
                text: "复习时你更常做什么？",
                tip: "选择越高代表复习越接近主动提取。",
                options: [
                    { label: "只看资料", desc: "主要重新阅读讲义", value: 1 },
                    { label: "看例题", desc: "通过示例回忆方法", value: 2 },
                    { label: "做错题", desc: "针对薄弱点训练", value: 3 },
                    { label: "自测输出", desc: "用测试或讲解检验掌握", value: 4 },
                ],
            },
            {
                text: "你是否会根据测试结果调整复习计划？",
                tip: "这决定系统是否需要动态生成下一轮任务。",
                options: frequencyOptions,
            },
            {
                text: "临近考试或验收时，你是否有冲刺节奏？",
                tip: "例如真题、模拟、查漏补缺。",
                options: clarityOptions,
            },
            {
                text: "你是否知道哪些内容需要反复复习？",
                tip: "高频错点和核心概念应进入滚动复习。",
                options: clarityOptions,
            },
        ],
        levels: [
            {
                maxRatio: 0.45,
                level: "复习断点型",
                description: "当前复习较随机，容易学过就忘，需要建立最小复习闭环。",
                resources: "生成滚动复习卡、错题提醒、每日小测和遗忘点清单。",
                nextStep: "先把最近 3 个薄弱知识点加入复习队列，每天复现一次。",
            },
            {
                maxRatio: 0.72,
                level: "闭环建立型",
                description: "你已有复习意识，但还需要把复习、练习和测试更稳定地串起来。",
                resources: "生成 3-7-14 天复习计划、错题变式、阶段小测和复盘模板。",
                nextStep: "完成一次小测后，让系统根据错题自动调整下一轮复习。",
            },
            {
                maxRatio: 1,
                level: "主动提取型",
                description: "复习节奏较成熟，可以更多采用输出、模拟和综合测试。",
                resources: "生成模拟卷、讲题脚本、综合复盘表和考前冲刺清单。",
                nextStep: "用一次限时自测检验复习效果，并把错题加入下一轮计划。",
            },
        ],
    },
    preference: {
        title: "资源偏好诊断",
        subtitle: "确定你更适合讲义、例题、卡片、视频脚本还是项目任务",
        scoreLabel: "资源匹配度",
        questions: [
            {
                text: "遇到新知识时，你最希望先看到哪类资源？",
                tip: "系统会优先生成你更容易吸收的格式。",
                options: [
                    { label: "概念讲义", desc: "先建立完整框架", value: 1 },
                    { label: "例题解析", desc: "边看题边理解方法", value: 2 },
                    { label: "练习卡片", desc: "用短任务快速上手", value: 3 },
                    { label: "项目任务", desc: "通过实践整合知识", value: 4 },
                ],
            },
            {
                text: "你更喜欢怎样的讲解粒度？",
                tip: "这会影响 AI 输出的详细程度。",
                options: [
                    { label: "非常详细", desc: "每个术语都解释", value: 1 },
                    { label: "步骤清楚", desc: "按流程一步步讲", value: 2 },
                    { label: "重点提示", desc: "只突出难点和易错点", value: 3 },
                    { label: "挑战引导", desc: "给提示，让我自己推", value: 4 },
                ],
            },
            {
                text: "你最能坚持完成哪种学习任务？",
                tip: "坚持度比形式本身更重要。",
                options: [
                    { label: "阅读整理", desc: "适合讲义和笔记", value: 1 },
                    { label: "跟做例题", desc: "适合样题和分步解析", value: 2 },
                    { label: "刷小题", desc: "适合短练习和错题卡", value: 3 },
                    { label: "做作品", desc: "适合项目制任务", value: 4 },
                ],
            },
            {
                text: "你希望反馈以什么形式出现？",
                tip: "系统会把反馈嵌入报告或任务流。",
                options: [
                    { label: "直接指出问题", desc: "告诉我哪里不对", value: 1 },
                    { label: "给修改建议", desc: "告诉我下一步怎么改", value: 2 },
                    { label: "给评分标准", desc: "让我对照清单自查", value: 3 },
                    { label: "模拟导师评审", desc: "像真实评审一样反馈", value: 4 },
                ],
            },
            {
                text: "你更希望资源输出多长？",
                tip: "控制信息密度，避免太长或太碎。",
                options: [
                    { label: "短卡片", desc: "1-3 分钟能看完", value: 1 },
                    { label: "中等讲义", desc: "一页内说明清楚", value: 2 },
                    { label: "完整专题", desc: "系统梳理一个知识点", value: 3 },
                    { label: "项目包", desc: "包含任务、材料和验收", value: 4 },
                ],
            },
            {
                text: "你希望 AI 生成资源时加入真实场景吗？",
                tip: "场景越真实，越接近应用训练。",
                options: [
                    { label: "暂时不用", desc: "先讲基础", value: 1 },
                    { label: "少量示例", desc: "帮助理解即可", value: 2 },
                    { label: "结合案例", desc: "用案例解释知识", value: 3 },
                    { label: "完整场景任务", desc: "直接做真实问题", value: 4 },
                ],
            },
            {
                text: "你愿意把学习结果用于下一次资源生成吗？",
                tip: "持续反馈能让资源越来越个性化。",
                options: frequencyOptions,
            },
        ],
        levels: [
            {
                maxRatio: 0.45,
                level: "讲义补给型",
                description: "你更适合从清晰、低负担的讲义和卡片开始，先减少理解成本。",
                resources: "优先生成概念讲义、术语卡、短例题和低门槛练习。",
                nextStep: "选择一个知识点，让系统输出一页讲义和 3 张复习卡。",
            },
            {
                maxRatio: 0.72,
                level: "例题训练型",
                description: "你适合通过例题、变式和反馈形成稳定掌握。",
                resources: "优先生成分步例题、变式练习、错因反馈和评分标准。",
                nextStep: "让 AI 针对一个薄弱点生成“例题-变式-自测”三段式资源。",
            },
            {
                maxRatio: 1,
                level: "项目实践型",
                description: "你更适合通过真实任务和作品反馈整合知识。",
                resources: "优先生成项目任务书、案例材料、验收清单和导师式评审。",
                nextStep: "选择一个目标，让系统生成可交付的小项目任务包。",
            },
        ],
    },
};

const DEFAULT_DIAGNOSIS = DIAGNOSIS_BANK.foundation;

export default {
    data() {
        return {
            diagnosisId: "foundation",
            currentIndex: 0,
            answers: [],
            showResult: false,
        };
    },
    computed: {
        currentDiagnosis() {
            return DIAGNOSIS_BANK[this.diagnosisId] || DEFAULT_DIAGNOSIS;
        },
        questions() {
            return this.currentDiagnosis.questions;
        },
        currentQuestion() {
            return this.questions[this.currentIndex] || this.questions[0];
        },
        progress() {
            return Math.round(((this.currentIndex + 1) / this.questions.length) * 100);
        },
        totalScore() {
            return this.answers.reduce((sum, item) => sum + (item || 0), 0);
        },
        scoreRatio() {
            const maxScore = this.questions.length * 4;
            return maxScore ? this.totalScore / maxScore : 0;
        },
        result() {
            return this.currentDiagnosis.levels.find((item) => this.scoreRatio <= item.maxRatio)
                || this.currentDiagnosis.levels[this.currentDiagnosis.levels.length - 1];
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
                    questionnaireName: this.currentDiagnosis.title,
                    questionnaireType: this.diagnosisId,
                    score: this.totalScore,
                    depressionLevel: this.result.level,
                    levelDescription: this.result.description,
                    resultData: {
                        diagnosisTitle: this.currentDiagnosis.title,
                        scoreLabel: this.currentDiagnosis.scoreLabel,
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
                console.error("保存学情诊断报告失败:", error);
                uni.showToast({
                    title: error?.message || "保存失败，请稍后重试",
                    icon: "none",
                });
            }
        },
        goBack() {
            uni.navigateBack();
        },
    },
    onLoad(options) {
        this.diagnosisId = options.id || "foundation";
        if (!DIAGNOSIS_BANK[this.diagnosisId]) {
            this.diagnosisId = "foundation";
        }
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

.test-header {
    margin-bottom: 24rpx;
}

.test-title,
.result-title {
    display: block;
    font-size: 36rpx;
    font-weight: 900;
    color: #16324f;
    line-height: 1.35;
}

.test-subtitle {
    display: block;
    margin-top: 8rpx;
    font-size: 25rpx;
    color: #60758a;
    line-height: 1.5;
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

.question-title {
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
