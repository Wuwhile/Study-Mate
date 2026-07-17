<template>
    <view class="resource-container">
        <view class="category-section">
            <scroll-view class="category-scroll" scroll-x>
                <view
                    v-for="item in categories"
                    :key="item.key"
                    class="category-item"
                    :class="{ active: currentCategory === item.key }"
                    @click="filterByCategory(item.key)"
                >
                    <uni-icons
                        class="category-icon"
                        :type="item.icon"
                        size="30"
                        :color="currentCategory === item.key ? '#ffffff' : '#d4744e'"
                    />
                    <text class="category-text">{{ item.name }}</text>
                </view>
            </scroll-view>
        </view>

        <view class="article-list" v-if="!loading">
            <view v-if="filteredArticles.length === 0" class="empty-state">
                <text class="empty-text">暂无匹配资源</text>
                <text class="empty-desc">切换分类，或让 AI 学习助手生成一份新的个性化资料。</text>
            </view>

            <view
                v-for="article in filteredArticles"
                :key="article.id"
                class="article-card"
                @click="viewArticle(article)"
            >
                <view class="card-header">
                    <view class="article-category" :class="getCategoryClass(article.category)">
                        <text>{{ getCategoryName(article.category) }}</text>
                    </view>
                    <view class="article-meta">
                        <text>{{ article.readCount }} 次使用</text>
                        <text>{{ formatDate(article.publishTime) }}</text>
                    </view>
                </view>

                <view class="card-content">
                    <text class="article-title">{{ article.title }}</text>
                    <text class="article-summary">{{ article.summary }}</text>
                    <view class="article-tags">
                        <text v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</text>
                    </view>
                </view>

                <view class="card-footer">
                    <view>
                        <text class="author-name">{{ article.author }}</text>
                        <text class="author-title">{{ article.authorTitle }}</text>
                    </view>
                    <text class="read-more">查看详情</text>
                </view>
            </view>
        </view>

        <view class="loading-container" v-if="loading">
            <view class="loading-spinner"></view>
            <text class="loading-text">加载资源中...</text>
        </view>

        <view class="article-modal" v-if="showArticle" @click="closeArticle">
            <view class="article-content" @click.stop>
                <view class="article-header">
                    <text class="modal-title">{{ selectedArticle.title }}</text>
                    <view class="close-btn" @click="closeArticle">
                        <uni-icons type="closeempty" size="26" color="#60758a" />
                    </view>
                </view>
                <scroll-view scroll-y class="article-body">
                    <view class="article-tags modal-tags">
                        <text v-for="tag in selectedArticle.tags" :key="tag" class="tag">{{ tag }}</text>
                    </view>
                    <text class="content-text">{{ selectedArticle.content }}</text>
                </scroll-view>
                <button class="close-button" @click="closeArticle">关闭</button>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            loading: true,
            currentCategory: "all",
            showArticle: false,
            selectedArticle: {},
            categories: [
                { key: "all", name: "全部", icon: "list" },
                { key: "concept", name: "知识讲义", icon: "paperclip" },
                { key: "practice", name: "练习生成", icon: "compose" },
                { key: "review", name: "复习计划", icon: "calendar" },
                { key: "project", name: "项目任务", icon: "folder-add" },
                { key: "exam", name: "考前冲刺", icon: "flag-filled" },
            ],
            articles: [
                {
                    id: 1,
                    title: "大模型个性化学习资源生成流程",
                    summary: "从学习画像、目标拆解、资源模板到质量评估，完整说明 Study-mate 如何生成个性化学习资料。",
                    content: `适用场景
当学习者已经完成学情诊断，系统需要根据基础水平、目标、时间、偏好和错题记录生成学习资源时，可以使用这套流程。

一、输入学习画像
学习画像至少包含五类信息：
1. 当前基础：先修知识、核心概念掌握度、最近错题类型。
2. 学习目标：考试、作业、项目、竞赛或能力提升。
3. 时间约束：每周可用时间、固定学习时段、截止日期。
4. 资源偏好：讲义、例题、短卡片、项目任务、视频脚本。
5. 反馈记录：练习正确率、耗时、反复出错的知识点。

二、选择资源模板
不同画像对应不同模板：
基础薄弱时，优先生成概念讲义、术语卡片和低门槛例题。
基础中等时，优先生成分层例题、错因分析和变式训练。
基础较好时，优先生成综合任务、项目实践和验收清单。

三、多智能体协作
诊断智能体负责提取薄弱点。
资源智能体负责生成讲义、题目、计划或项目任务。
评价智能体负责检查内容是否覆盖目标、难度是否合适、表述是否清晰。
计划智能体负责把资源放入每日或每周任务。

四、输出格式建议
每份资源都应包含：学习目标、先修要求、核心内容、示例、练习、答案或验收标准、下一步建议。

五、迭代机制
学习者完成资源后，系统记录正确率、耗时、主观难度和反馈。下一轮生成时，系统降低重复内容比例，提高薄弱点权重。这样资源库不是静态资料，而是会随学习状态不断更新。`,
                    category: "concept",
                    author: "资源生成智能体",
                    authorTitle: "个性化内容编排",
                    publishTime: "2026-07-01",
                    readCount: 2186,
                    tags: ["大模型", "资源生成", "学习画像"],
                },
                {
                    id: 2,
                    title: "机器学习核心概念速通讲义",
                    summary: "围绕数据集、特征、模型、损失函数、训练、验证和泛化能力建立入门知识框架。",
                    content: `学习目标
读完本讲义后，你应能说清楚机器学习的基本流程，并理解模型为什么需要训练、验证和评估。

一、什么是机器学习
机器学习不是直接写死规则，而是让模型从数据中学习规律。典型流程是：收集数据，提取特征，选择模型，训练参数，验证效果，再部署或继续迭代。

二、数据集与特征
数据集是样本的集合。每个样本通常包含输入特征和目标标签。
特征可以理解为描述样本的变量，例如房屋面积、位置、楼层可以作为预测房价的特征。
好的特征应当与目标相关、可计算、可解释，并且尽量减少噪声。

三、模型与参数
模型是从输入到输出的映射函数。线性回归、决策树、神经网络都是模型。
训练过程就是不断调整模型参数，让预测结果更接近真实标签。

四、损失函数
损失函数衡量预测错误程度。损失越小，模型在训练数据上的表现通常越好。
但训练损失低并不代表模型一定好，因为模型可能只记住训练样本，这就是过拟合。

五、训练集、验证集与测试集
训练集用于学习参数。
验证集用于选择模型和调参。
测试集用于最终评估泛化能力。
如果把测试集用于反复调参，最终评估会失真。

六、常见评估指标
分类任务常用准确率、召回率、精确率、F1 值。
回归任务常用 MAE、MSE、RMSE。
选择指标时要结合业务目标，例如疾病筛查更关注召回率，垃圾邮件过滤可能更关注精确率。

七、易错提醒
不要只看准确率。类别不平衡时，模型全部预测多数类也可能准确率很高。
不要把训练集表现当成真实能力。
不要忽略数据泄露，例如把答案相关字段放进特征。

配套练习
1. 用自己的话解释训练集和测试集的区别。
2. 举一个过拟合的例子。
3. 当数据类别严重不平衡时，为什么准确率可能不可靠？
4. 为“预测学生是否按时完成作业”设计三个可能的特征。`,
                    category: "concept",
                    author: "知识讲义智能体",
                    authorTitle: "概念框架生成",
                    publishTime: "2026-07-02",
                    readCount: 1642,
                    tags: ["机器学习", "概念讲义", "入门"],
                },
                {
                    id: 3,
                    title: "Python 基础薄弱点专项练习包",
                    summary: "围绕变量、条件、循环、函数、列表和字典生成分层练习，并配套答案思路。",
                    content: `适用对象
适合能看懂 Python 代码，但独立写题时容易卡在语法、循环边界或数据结构选择上的学习者。

第一层：语法热身
1. 输入一个整数 n，输出 1 到 n 的所有偶数。
2. 给定三个成绩，计算平均分，并按 90/80/60 给出等级。
3. 将字符串 "study-mate" 中的字母逐个输出。

训练目标：熟悉变量、条件判断、for 循环和基本输入输出。

第二层：列表与字典
1. 给定列表 [76, 88, 59, 91, 68]，输出最高分、最低分和平均分。
2. 给定学生成绩字典，筛选出不及格学生姓名。
3. 统计一段文本中每个单词出现次数。

训练目标：理解列表遍历、字典键值结构和统计型问题。

第三层：函数封装
1. 写一个函数 is_prime(n)，判断一个数是否为素数。
2. 写一个函数 normalize_scores(scores)，把成绩转换成 0-1 区间。
3. 写一个函数 get_top_students(records, k)，返回成绩最高的 k 名学生。

训练目标：把重复逻辑封装成函数，提高代码可复用性。

第四层：综合小任务
设计一个学习记录分析程序：
输入多天的学习时长和完成题数，输出总学习时长、平均每日题数、效率最高的一天，并给出一句学习建议。

参考思路
先用列表保存每天记录，再用循环计算统计值。效率可以定义为“完成题数 / 学习时长”。最后根据平均效率判断建议，例如“建议增加复盘时间”或“可以尝试更高难度题目”。

常见错因
1. 循环范围多一位或少一位。
2. 字典取值时键名写错。
3. 函数有返回值却忘记 return。
4. 整数除法和浮点除法混用。

完成标准
能够独立写出第二层题目的大部分代码，并能在提示下完成第三层函数封装。`,
                    category: "practice",
                    author: "练习生成智能体",
                    authorTitle: "题目与解析生成",
                    publishTime: "2026-07-03",
                    readCount: 1438,
                    tags: ["Python", "专项练习", "自动解析"],
                },
                {
                    id: 4,
                    title: "数据结构错题变式训练：栈、队列与哈希表",
                    summary: "针对常见错题类型生成变式题，帮助学习者从“会一题”过渡到“会一类题”。",
                    content: `训练目标
理解栈、队列、哈希表的适用场景，并能在题目描述中识别应该使用哪种结构。

一、栈
典型特征：后进先出，常用于括号匹配、表达式求值、撤销操作、单调栈。

基础题
判断字符串中的括号是否匹配。例如输入 "([]{})" 输出 true，输入 "([)]" 输出 false。

变式题
1. 输入一段编辑操作，其中 "#" 表示退格，判断最终字符串是否相同。
2. 设计浏览器前进后退功能，支持 visit、back、forward 操作。
3. 给定每日温度，求每一天需要等待几天才会出现更高温度。

二、队列
典型特征：先进先出，常用于任务调度、广度优先搜索、消息排队。

基础题
模拟打印队列：每个任务有优先级，高优先级先打印。

变式题
1. 用队列实现最近请求窗口统计。
2. 用 BFS 求二维网格中从起点到终点的最短步数。
3. 设计一个固定长度的循环队列。

三、哈希表
典型特征：快速查找，常用于计数、去重、映射关系。

基础题
两数之和：给定数组和目标值，返回两个数下标。

变式题
1. 判断两个字符串是否为异位词。
2. 统计数组中出现次数超过一半的元素。
3. 给定学生提交记录，统计每名学生的通过题数。

四、选择结构的方法
如果题目强调最近、撤销、匹配，优先考虑栈。
如果题目强调顺序处理、层级扩散、排队，优先考虑队列。
如果题目强调快速查找、计数、映射，优先考虑哈希表。

复盘模板
题目关键词：
我最初选择的数据结构：
实际更合适的数据结构：
错因：
下一次识别信号：

建议做法
每做完一道错题，不要只看答案。至少再做一道同结构变式题，并用一句话写出“为什么这个结构适合”。`,
                    category: "practice",
                    author: "错题变式智能体",
                    authorTitle: "薄弱点训练",
                    publishTime: "2026-07-04",
                    readCount: 982,
                    tags: ["数据结构", "错题变式", "算法"],
                },
                {
                    id: 5,
                    title: "7 天机器学习入门复习计划",
                    summary: "覆盖监督学习、模型评估、过拟合处理与小项目实践，适合短周期建立知识闭环。",
                    content: `计划定位
这是一份 7 天入门复习计划，不追求覆盖所有算法，而是帮助你建立“概念-例题-练习-项目-复盘”的闭环。

第 1 天：建立基本框架
学习内容：数据集、特征、标签、训练集、验证集、测试集。
任务：画出一个机器学习任务流程图。
验收：能说清楚模型训练和模型评估的区别。

第 2 天：线性回归与逻辑回归
学习内容：回归任务、分类任务、损失函数、决策边界。
任务：用表格比较线性回归和逻辑回归。
练习：判断 5 个现实问题属于回归还是分类。

第 3 天：决策树与随机森林
学习内容：特征划分、树深度、集成学习、特征重要性。
任务：用一个生活例子解释决策树。
练习：分析树模型为什么容易过拟合。

第 4 天：评估指标
学习内容：准确率、精确率、召回率、F1、混淆矩阵。
任务：手算一个二分类混淆矩阵的指标。
验收：能解释为什么类别不平衡时不能只看准确率。

第 5 天：过拟合与泛化
学习内容：正则化、交叉验证、数据增强、早停。
任务：列出三种减少过拟合的方法。
练习：判断给定训练/验证曲线是否过拟合。

第 6 天：完成一个小项目
项目：使用公开表格数据完成一个分类任务。
步骤：读取数据、划分数据集、训练模型、输出指标、写结论。
要求：至少比较两个模型。

第 7 天：复盘与下一阶段计划
复盘内容：最薄弱概念、最容易错的指标、项目中最卡的步骤。
输出：下一周学习计划，包括 2 个知识点、1 组练习、1 个小项目。

AI 辅助建议
每天结束后，把“今天最不懂的一点”和“做错的一题”发给 Study-mate，让资源智能体生成第二天的补充讲义和变式题。`,
                    category: "review",
                    author: "计划智能体",
                    authorTitle: "阶段学习规划",
                    publishTime: "2026-07-05",
                    readCount: 1816,
                    tags: ["机器学习", "复习计划", "项目实践"],
                },
                {
                    id: 6,
                    title: "错题驱动的三轮复习法",
                    summary: "用错题建立复习队列，把知识点回看、变式训练和限时自测串成闭环。",
                    content: `为什么用错题驱动复习
错题是学习画像里最有价值的数据。它不仅说明你哪里错了，还能暴露知识断点、审题习惯、计算稳定性和迁移能力。

第一轮：错因归类
把错题分成四类：
1. 概念不清：不知道定义、条件或原理。
2. 方法选择错误：不知道用哪个公式、算法或步骤。
3. 执行失误：会做但漏步、算错或写错。
4. 迁移失败：基础题会，换场景就不会。

每道错题只标一个主错因，避免标签过多导致无法行动。

第二轮：资源补给
不同错因对应不同资源：
概念不清，生成短讲义和术语卡。
方法选择错误，生成对比表和例题拆解。
执行失误，生成步骤清单和检查表。
迁移失败，生成变式题和综合任务。

第三轮：限时自测
复习不是重新看答案，而是主动提取。
建议每 3 天进行一次 15-20 分钟小测，只测最近反复出错的知识点。

复习节奏
当天：整理错因。
第 2 天：做一道同类题。
第 4 天：做一道变式题。
第 7 天：做一次混合小测。
第 14 天：把仍然错误的题加入重点复习队列。

记录模板
题目：
知识点：
主错因：
正确思路：
同类题结果：
下次提醒：

判断复习有效的标准
不是“看懂答案”，而是“隔几天后不看答案仍能讲清思路，并能完成一道变式题”。`,
                    category: "review",
                    author: "复盘智能体",
                    authorTitle: "错题与节奏管理",
                    publishTime: "2026-07-06",
                    readCount: 1204,
                    tags: ["错题复盘", "滚动复习", "自测"],
                },
                {
                    id: 7,
                    title: "多智能体学习系统课程项目任务书",
                    summary: "以诊断、资源生成、答疑、评价四类智能体为核心，完成一个闭环学习系统原型。",
                    content: `项目目标
构建一个基于大模型的个性化资源生成与学习多智能体系统。系统应支持学情诊断、资源生成、AI 答疑、学习记录保存和结果评价。

角色设计
1. 诊断智能体
输入问卷、错题、学习目标，输出学习画像和薄弱点。

2. 资源生成智能体
根据画像生成讲义、练习、复习计划、项目任务和考前清单。

3. 答疑智能体
围绕学习者提问进行分层解释，先给提示，再给思路，最后给完整解答。

4. 评价智能体
检查资源质量、题目难度、答案准确性，并根据学习反馈调整下一轮资源。

功能模块
前端模块：登录注册、学情诊断、学习资源库、AI 学习助手、个人中心。
后端模块：用户认证、诊断结果保存、会话管理、资源接口、AI 调用接口。
数据库模块：用户表、诊断结果表、会话表、消息表、学习记录表。

核心流程
用户完成学情诊断。
系统生成画像并保存。
资源智能体根据画像生成推荐资料。
用户在 AI 学习助手中提问。
系统保存学习对话和反馈。
评价智能体更新后续资源难度。

验收标准
1. 至少完成 3 类智能体的功能闭环。
2. 至少支持 5 类学习资源展示。
3. 诊断结果能保存并在历史页查看。
4. AI 对话能创建、保存和查看历史。
5. 项目文档说明系统架构、数据表、接口和提示词设计。

扩展方向
加入学习进度图表、知识点掌握雷达图、资源自动生成接口、教师端审核功能。`,
                    category: "project",
                    author: "项目导师智能体",
                    authorTitle: "任务拆解与验收",
                    publishTime: "2026-07-08",
                    readCount: 1126,
                    tags: ["多智能体", "课程设计", "系统开发"],
                },
                {
                    id: 8,
                    title: "学习助手提示词工程实验任务",
                    summary: "通过提示词模板、对比实验和评价标准，训练学生理解大模型输出控制方法。",
                    content: `实验目标
掌握面向学习场景的大模型提示词设计方法，能够控制输出结构、难度、语气和评价标准。

实验一：基础讲解提示词
任务：让模型解释一个课程概念。
要求输出包含：概念定义、生活类比、公式或规则、常见误区、两道练习题。

提示词模板
你是一名课程助教，请面向基础薄弱的学生解释【知识点】。要求语言简洁，先讲直觉，再讲正式定义，最后给两个由浅入深的练习。

实验二：错题解析提示词
任务：让模型分析一道错题。
要求输出包含：考察知识点、错误原因、正确思路、同类变式、复习建议。

实验三：资源生成提示词
任务：根据学习画像生成个性化资源。
输入字段：目标、基础、时间、偏好、薄弱点。
输出字段：学习目标、讲义、例题、练习、答案、下一步计划。

实验四：评价提示词
任务：让模型检查一份生成资源的质量。
评价维度：准确性、覆盖度、难度匹配、结构清晰度、可操作性。

对比要求
每个实验至少设计两个提示词版本，并比较输出差异。
观察模型是否出现过度泛化、遗漏约束、题目无答案、难度不匹配等问题。

提交内容
1. 四组提示词。
2. 模型输出样例。
3. 对比分析表。
4. 最终优化后的提示词。
5. 你认为最有效的约束条件说明。

评分建议
结构完整 30 分，提示词有效性 30 分，对比分析 20 分，学习场景贴合度 20 分。`,
                    category: "project",
                    author: "提示词实验智能体",
                    authorTitle: "实验设计",
                    publishTime: "2026-07-09",
                    readCount: 764,
                    tags: ["提示词工程", "实验任务", "评价标准"],
                },
                {
                    id: 9,
                    title: "考前 48 小时冲刺清单",
                    summary: "压缩复习目标，优先处理高频考点、易错题和可快速提分的知识块。",
                    content: `核心原则
考前 48 小时不适合从头学习大量新内容，应围绕“高频、易错、可提分”三个关键词行动。

第一阶段：快速盘点
用 30 分钟列出：
1. 高频考点。
2. 最近三次错题。
3. 仍然说不清的概念。
4. 公式、算法或步骤模板。

第二阶段：高频考点复现
不要只是看资料。每个高频考点都要完成一次主动输出：
写定义。
写适用条件。
写一个例题步骤。
写一个易错提醒。

第三阶段：错题压缩复盘
只看最有价值的错题：
反复错的题。
覆盖核心知识点的题。
能代表一类方法的题。

每道错题只回答三个问题：
我当时为什么错？
正确方法的第一步是什么？
下次看到什么信号要警惕？

第四阶段：限时小测
用 40-60 分钟做一套小测或混合题。
做完后不要大面积补课，只记录最影响得分的 3 个问题。

第五阶段：睡前提纲
睡前只看提纲，不再扩展新内容。
提纲包括公式、易错点、答题步骤和时间分配。

禁止事项
不要临时打开全新章节。
不要连续刷难题导致信心崩掉。
不要只看答案不动笔。
不要熬夜到影响第二天状态。

AI 使用方式
把你的错题清单发给 Study-mate，让它生成“最后 48 小时复习优先级”和 10 道压缩小测题。`,
                    category: "exam",
                    author: "评价智能体",
                    authorTitle: "复盘与提分建议",
                    publishTime: "2026-07-10",
                    readCount: 1956,
                    tags: ["考前冲刺", "错因分析", "提分"],
                },
                {
                    id: 10,
                    title: "算法题考前模板：读题、建模、验证",
                    summary: "整理算法题答题模板，帮助学生在考试或机试中稳定完成分析和代码实现。",
                    content: `适用场景
适用于算法考试、机试、课程设计答辩前的快速复盘。

一、读题模板
先确认输入规模。输入规模决定能否使用暴力算法。
再确认输出要求。是返回数量、路径、最优值，还是具体方案。
最后确认边界条件。空数组、单个元素、重复值、负数、无法到达等情况很容易丢分。

二、建模模板
如果题目要求“最短、最少步数、层级扩散”，考虑 BFS。
如果题目要求“所有方案、路径搜索、组合枚举”，考虑 DFS 或回溯。
如果题目要求“连续子数组、窗口内统计”，考虑滑动窗口。
如果题目要求“快速查找、计数、去重”，考虑哈希表。
如果题目要求“最优子结构、重复子问题”，考虑动态规划。

三、代码实现模板
1. 写清楚变量含义。
2. 先处理边界条件。
3. 主循环只做一件事。
4. 每次更新答案时写注释或自查。
5. 最后用样例和自造边界测试。

四、验证模板
至少验证三类数据：
题目样例。
最小规模样例。
特殊边界样例。

五、动态规划快速检查
状态是什么？
转移从哪里来？
初始值是什么？
遍历顺序是什么？
答案取哪个状态？

六、常见扣分点
数组越界。
初始化错误。
没有处理空输入。
把最大值/最小值初始成不合理数字。
递归没有终止条件。
复杂度超过输入规模。

考前练习建议
不要盲目刷新题。选择 5 道典型题，每道题写出“题目信号-算法选择-边界条件-复杂度”。`,
                    category: "exam",
                    author: "算法冲刺智能体",
                    authorTitle: "机试策略",
                    publishTime: "2026-07-11",
                    readCount: 1388,
                    tags: ["算法", "机试", "答题模板"],
                },
            ],
        };
    },
    computed: {
        filteredArticles() {
            if (this.currentCategory === "all") return this.articles;
            return this.articles.filter((article) => article.category === this.currentCategory);
        },
    },
    methods: {
        async loadArticles() {
            this.loading = true;
            await new Promise((resolve) => setTimeout(resolve, 300));
            this.loading = false;
        },
        filterByCategory(category) {
            this.currentCategory = category;
        },
        getCategoryName(category) {
            const map = {
                concept: "知识讲义",
                practice: "练习生成",
                review: "复习计划",
                project: "项目任务",
                exam: "考前冲刺",
            };
            return map[category] || "学习资源";
        },
        getCategoryClass(category) {
            return `category-${category}`;
        },
        formatDate(dateStr) {
            return new Date(dateStr).toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
        },
        viewArticle(article) {
            this.selectedArticle = article;
            this.showArticle = true;
        },
        closeArticle() {
            this.showArticle = false;
            this.selectedArticle = {};
        },
    },
    onShow() {
        this.loadArticles();
    },
};
</script>

<style lang="scss">
.resource-container {
    min-height: 100vh;
    background: linear-gradient(180deg, #f7fbff 0%, #eef6f2 58%, #fffaf0 100%);
    padding-bottom: 40rpx;
}

.category-section {
    padding: 24rpx 30rpx 12rpx;
}

.category-scroll {
    white-space: nowrap;
}

.category-item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 18rpx 26rpx;
    margin-right: 18rpx;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 18rpx;
    border: 1rpx solid #dfe9f3;
}

.category-item.active {
    background: #16324f;
    border-color: #16324f;

    .category-text {
        color: #fff;
    }
}

.category-icon {
    margin-bottom: 8rpx;
}

.category-text {
    font-size: 23rpx;
    color: #16324f;
    font-weight: 700;
}

.article-list {
    padding: 0 30rpx;
}

.article-card {
    background: rgba(255, 255, 255, 0.96);
    border-radius: 18rpx;
    padding: 28rpx;
    margin-bottom: 22rpx;
    box-shadow: 0 10rpx 24rpx rgba(31, 55, 83, 0.1);
}

.card-header,
.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.article-category {
    padding: 7rpx 16rpx;
    border-radius: 12rpx;
    font-size: 20rpx;
    font-weight: 700;
    color: #16324f;
    background: #eaf4ff;
}

.category-practice {
    background: #e8f8ef;
    color: #0f7b51;
}

.category-review {
    background: #fff4d8;
    color: #946200;
}

.category-project {
    background: #f0eafe;
    color: #6842a2;
}

.category-exam {
    background: #ffecea;
    color: #a7352a;
}

.article-meta {
    display: flex;
    flex-direction: column;
    text-align: right;
    font-size: 20rpx;
    color: #8a9aab;
}

.card-content {
    padding: 22rpx 0;
}

.article-title {
    display: block;
    font-size: 31rpx;
    font-weight: 800;
    color: #172b4d;
    margin-bottom: 12rpx;
}

.article-summary {
    display: block;
    font-size: 24rpx;
    color: #536578;
    line-height: 1.6;
}

.article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
    margin-top: 16rpx;
}

.tag {
    font-size: 19rpx;
    color: #2f80ed;
    background: #edf5ff;
    padding: 5rpx 12rpx;
    border-radius: 12rpx;
}

.author-name {
    display: block;
    font-size: 22rpx;
    color: #172b4d;
    font-weight: 700;
}

.author-title,
.read-more {
    font-size: 20rpx;
    color: #60758a;
}

.read-more {
    color: #2f80ed;
    font-weight: 700;
}

.empty-state,
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 110rpx 40rpx;
    color: #60758a;
}

.empty-text {
    font-size: 30rpx;
    font-weight: 700;
}

.empty-desc,
.loading-text {
    margin-top: 12rpx;
    font-size: 24rpx;
}

.loading-spinner {
    width: 52rpx;
    height: 52rpx;
    border: 4rpx solid #dbe7f3;
    border-top-color: #2f80ed;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.article-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 40rpx;
}

.article-content {
    width: 100%;
    max-width: 640rpx;
    max-height: 86vh;
    background: #fff;
    border-radius: 20rpx;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.article-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx;
    border-bottom: 1rpx solid #e8eef5;
    gap: 18rpx;
}

.modal-title {
    flex: 1;
    min-width: 0;
    font-size: 30rpx;
    font-weight: 800;
    color: #172b4d;
    line-height: 1.45;
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

.article-body {
    box-sizing: border-box;
    width: 100%;
    padding: 0 40rpx 8rpx;
    max-height: 62vh;
    overflow-x: hidden;
}

.modal-tags {
    margin-bottom: 18rpx;
}

.content-text {
    display: block;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    font-size: 26rpx;
    color: #172b4d;
    line-height: 1.85;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;
}

.close-button {
    margin: 24rpx 32rpx 32rpx;
    background: #2f80ed;
    color: #fff;
    border-radius: 16rpx;
}
</style>
