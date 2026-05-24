import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle, TrendingUp, TrendingDown, Target, Shield, Swords, Flag, Calculator, BookOpen, AlertCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from 'recharts';

const scripts = [
  {
    id: 1, code: '2.1', icon: '💰', title: '投资模式与分成比例', importance: '决定性',
    opening: '陈总，这次合作我方是全资源投入：直播间、8人团队、设备、培训、达人储备——月固定支出11万元起。按重资产投入方主导分配的行业惯例，我方提议：投流双方50/50共担，分成乙方60% / 甲方40%。',
    counters: [
      { t: '"运营成本对你们来说是固定开支，不应让品牌方承担"', o: '数据说话：按1000万GMV+50%退货率+ROI 8，50/50分成下我方年亏45万。亏钱的合作做不长——这点您比我更清楚。' },
      { t: '"我们投入更大——产品研发、库存、品牌授权费"', o: '这些已计入"产品底价"80元里，您从第一单起就开始回收成本。我方的投入要靠分成慢慢回本，回报周期不同。' },
      { t: '"其他合作方都接受50/50"', o: '那些是代播或纯佣模式，我方是深度联营+达人矩阵+组织绑定，对标的不是同一类合作。可以设阶梯：保底分成乙方60%，超额超出部分让步到55%。' }
    ],
    path: [
      { s: '开局锚点', v: '60 : 40', why: '全资源投入+承担运营固定成本' },
      { s: '一次让步', v: '58 : 42', why: '换取审计权或独享期延长' },
      { s: '二次让步', v: '55 : 45', why: '换取合资触发条款明确化' },
      { s: '底线', v: '52 : 48', why: '换取投流决策权+定价主导权' },
      { s: '红线', v: '50 : 50', why: '低于此值除非甲方分担月运营成本50%' }
    ],
    tradeoffs: ['独享期延长', '授权费阶梯细化', '渠道范围扩大', '合作期限延长'],
    redLine: '分成<50% 且甲方拒担任何运营成本 → 直接退出谈判'
  },
  {
    id: 2, code: '2.4', icon: '⚡', title: '投流决策权', importance: '极高',
    opening: '投流是直播电商的"秒级反应"赛道。我方提议：月度投流预算由乙方制定、甲方备案；单次广告策略由乙方运营团队决定，超ROI红线启动复盘。',
    counters: [
      { t: '"投流花的是双方的钱，必须共同决策"', o: '设定ROI红线（如≤6启动复盘+暂停），超支自动由乙方承担。决策权下放，但责任也下放——这是公平的。' },
      { t: '"万一你们烧钱乱投呢"', o: '设月度预算上限+日预算告警机制。每周一份投流复盘报告，数据完全透明。' },
      { t: '"超过XX万的单次投放必须审批"', o: '直播投流的本质是"测款-放量"循环，单次投放阈值不能低于5万，否则错过爆款窗口。审批走的是月度总预算，不是单笔。' }
    ],
    path: [
      { s: '开局', v: '乙方决定+月度备案', why: '速度=GMV' },
      { s: '中段', v: '月超10%审批', why: '保留弹性' },
      { s: '让步', v: '月超5%审批+单笔5万+', why: '换其他条款' },
      { s: '红线', v: '单笔3万+审批', why: '业务无法执行' }
    ],
    tradeoffs: ['周复盘报告', '设ROI止损线', '总预算硬上限'],
    redLine: '所有投流策略需事前审批 → 业务死局'
  },
  {
    id: 3, code: '3.1', icon: '🎯', title: '达人排他性保护', importance: '极高',
    opening: '我方已合作及孵化的达人是乙方核心资产。同品牌下，甲方及甲方其他合作方均不得切入我方达人池——以乙方每月更新的备案清单为准，锁定12个月。',
    counters: [
      { t: '"限制太死，影响品牌曝光"', o: '不限制甲方接触新达人，只保护我方已经投入资源的达人池。每月清单更新，您完全可见。' },
      { t: '"什么叫\'已合作\'？合作过一场就算？"', o: '双重认定：①近12个月内与乙方有成交合作 ②在乙方备案清单中。两个条件之一即生效。' },
      { t: '"我们也想自播+找达人"', o: '甲方自播+自找达人，请提前7天报备名单，避免与乙方达人撞车导致价格穿底。' }
    ],
    path: [
      { s: '开局', v: '备案+12个月排他', why: '保护达人资产' },
      { s: '一次让步', v: '备案+9个月', why: '换分成或独享' },
      { s: '让步', v: '备案+6个月', why: '换合资条款' },
      { s: '底线', v: '备案+3个月', why: '勉强可保护' },
      { s: '红线', v: '无任何排他', why: '退出' }
    ],
    tradeoffs: ['让分成1-2%', '让独享期', '让渠道范围'],
    redLine: '甲方拒绝任何形式的达人排他保护 → 退出'
  },
  {
    id: 4, code: '4.2', icon: '🛡️', title: '退款/坏账承担机制', importance: '极高',
    opening: '退款分三类承担：①质量问题退款，甲方全担；②七天无理由退款，按分成比例同担；③恶意退款（薅羊毛/团伙作案），甲方全担并启动法务追损。',
    counters: [
      { t: '"七天无理由都按比例同担太苛刻"', o: '50%退货率行业常态，必须分类承担，否则50/50也是亏。质量问题占退货约15%，恶意退款占5%，剩下80%七天无理由按比例同担，已经够公平。' },
      { t: '"恶意退款怎么界定"', o: '同一身份证/地址/IP/手机号月退≥3单 OR 退货率>80%的客户=恶意。技术后台可识别。' },
      { t: '"七天无理由也是我们的产品问题啊"', o: '七天无理由本质是平台规则，与产品质量无关。试穿不合适、颜色不喜欢都属此类。运营和品牌共同承担合理。' }
    ],
    path: [
      { s: '开局', v: '三类分担+恶意全归甲方', why: '风险共担' },
      { s: '让步', v: '质量甲全担/其他按比例', why: '换其他条款' },
      { s: '底线', v: '所有退款按比例同担', why: '勉强接受' },
      { s: '红线', v: '退款全归乙方', why: '退出' }
    ],
    tradeoffs: ['月度坏账上限', '质量退款赔偿机制', '风控数据共享'],
    redLine: '乙方独担所有退款损失 → 退出'
  },
  {
    id: 5, code: '4.1', icon: '📅', title: '结算周期与现金流', importance: '极高',
    opening: '月结：对账截止次月6日，付款截止次月15日。逾期按日万分之五计息。乙方仅就分成部分对甲方开6%专票。',
    counters: [
      { t: '"15日太紧，财务流程跟不上"', o: '电商行业账期就是月结快进。可以让到20日，但必须签逾期利息条款。' },
      { t: '"对账有争议就整单挂账"', o: '争议金额单独挂账，无争议部分必须先付——否则一个小分歧拖死乙方现金流。' }
    ],
    path: [
      { s: '开局', v: '次月15日+逾期息', why: '现金流命脉' },
      { s: '让步', v: '次月20日+逾期息', why: '可接受' },
      { s: '底线', v: '次月25日+预付10%', why: '勉强' },
      { s: '红线', v: '次月30+无逾期约束', why: '退出' }
    ],
    tradeoffs: ['首月预付30%运营保证金', '逾期利率', '争议处理时效'],
    redLine: '账期>30天 + 无逾期约束 + 全单挂账机制 → 退出'
  },
  {
    id: 6, code: '5.2', icon: '🔓', title: '后台数据完全访问权', importance: '极高',
    opening: '店铺后台、千川、电商罗盘、抖店财务数据，乙方拥有完全访问权限，含实时财务流水。可签独立数据保密协议。',
    counters: [
      { t: '"财务数据涉及商业秘密"', o: '联营模式下数据透明是基础——没有数据就没有决策。可以排除"非合作品牌"数据，只开放本品牌相关。' },
      { t: '"怕你们带走数据另起炉灶"', o: '数据使用边界条款+违约赔偿（如GMV的10倍）+合作终止后数据销毁审计。' }
    ],
    path: [
      { s: '开局', v: '完全访问+实时', why: '运营基础' },
      { s: '让步', v: '完全访问+财务日同步', why: '基本可行' },
      { s: '底线', v: '主要数据日同步', why: '勉强' },
      { s: '红线', v: '财务数据限时关闭', why: '退出' }
    ],
    tradeoffs: ['数据保密协议', '使用边界条款', '违约赔偿额度'],
    redLine: '关闭后台财务数据访问 → 退出'
  },
  {
    id: 7, code: '6.1', icon: '🔍', title: '成本透明与审计权', importance: '极高',
    opening: '产品底价必须四项明细透明：原料+生产+授权摊销+物流。乙方有权每季度委托第三方独立审计。审计证实虚报>5%，甲方承担审计费+差价3倍赔偿；未发现问题，乙方承担审计费。',
    counters: [
      { t: '"成本构成是核心商业秘密"', o: '联营即合伙，合伙人之间没有秘密。这是分成模式的法理基础——按毛利分，毛利不透明，分成就不公平。' },
      { t: '"审计权太具进攻性"', o: '审计是双向的——证实诚信经营反而是甲方的信用资产。我方愿意承担首次审计费。' },
      { t: '"成本会浮动，怎么界定？"', o: '原料按月度采购加权平均，生产按工时折算，授权按阶梯，物流按实际。每季度更新一次成本表。' }
    ],
    path: [
      { s: '开局', v: '四项明细+季度审计权', why: '反虚报武器' },
      { s: '让步', v: '四项明细+年度审计权', why: '可接受' },
      { s: '底线', v: '四项明细+查阅权', why: '勉强' },
      { s: '红线', v: '只给最终底价', why: '退出' }
    ],
    tradeoffs: ['保密协议', '审计触发条件', '赔偿倍数'],
    redLine: '甲方拒绝任何形式的成本透明 → 退出（信任基础不存在）'
  },
  {
    id: 8, code: '6.2', icon: '📊', title: '授权费阶梯分摊', importance: '极高',
    opening: '品牌授权费按销量阶梯分摊（建议5档），销量越大，单件分摊越低。例：0-100万件×3元，100-500万件×2元，500-1000万件×1.5元，1000-3000万件×1元，3000万+×0.8元。',
    counters: [
      { t: '"授权费是固定的，怎么阶梯？"', o: '固定授权费在阶梯设计上反而对甲方有利——销量翻倍时单件分摊砍半，激励乙方做大盘子。' },
      { t: '"阶梯太复杂，账难算"', o: '我方提供测算模板和自动化结算工具，每月一键算清。' },
      { t: '"为什么要5档不是3档？"', o: '5档精细化激励，避免临近档位时为冲量做无效投流。3档容易卡在临界点。' }
    ],
    path: [
      { s: '开局', v: '5档阶梯', why: '精细激励' },
      { s: '让步', v: '4档阶梯', why: '可接受' },
      { s: '底线', v: '3档阶梯', why: '勉强' },
      { s: '红线', v: '固定单件摊销', why: '伤害规模效应' }
    ],
    tradeoffs: ['档位阈值', '单件分摊金额', '阶梯生效时点'],
    redLine: '坚持固定单件分摊 → 直接影响测算模型，需重谈分成'
  },
  {
    id: 9, code: '7.1', icon: '🎚️', title: '定价主导权与调价权', importance: '极高',
    opening: '①品牌方有限价时，在限价区间内乙方建议价为默认价。②无限价时，乙方建议价为默认，分歧时双方共商。③促销/秒杀，乙方在不低于底价的前提下自主调价。',
    counters: [
      { t: '"随便降价会伤害品牌价值"', o: '所有调价都有数据复盘+月度报告。直播定价是数据驱动，不是拍脑袋。设"价格底线"机制（如不低于底价的120%），即可保护品牌。' },
      { t: '"甲方有定价主导权才合理"', o: '分工清晰更高效：甲方定底价（保护成本），乙方定售价（适配市场）。否则甲方天天接到运营消息——5分钟内必须决定要不要降5块，做不到。' }
    ],
    path: [
      { s: '开局', v: '乙方主导+品牌限价内', why: '速度' },
      { s: '让步', v: '<15%调价乙决/>15%共商', why: '弹性兼顾' },
      { s: '底线', v: '<10%调价乙决', why: '勉强' },
      { s: '红线', v: '所有调价需书面同意', why: '业务死局' }
    ],
    tradeoffs: ['价格底线%', '调价复盘频率', '品牌伤害赔偿条款'],
    redLine: '所有调价需甲方书面同意 → 退出'
  },
  {
    id: 10, code: '8.1', icon: '🏭', title: '翻单时效与断货赔付', importance: '极高',
    opening: '测出爆款后，15个工作日内完成深度生产并到仓。特殊工艺品类提前列入"特殊清单"另行约定。超期断货按预计GMV损失的5%赔付乙方。',
    counters: [
      { t: '"工厂产能不可控"', o: '合作前签订"产能档位承诺"，分常规品/特殊品两档。爆款信号至少提前3天给到甲方，让供应链有备料窗口。' },
      { t: '"赔付5%太重"', o: '这是激励而非惩罚——避免错过爆款窗口对双方都是损失。可设上限（如单品赔付不超10万）。' },
      { t: '"特殊工艺范围太宽"', o: '把"特殊清单"具体化：哪些工艺、哪些品类、需要多少天，逐一列入合同附件，避免变成万能借口。' }
    ],
    path: [
      { s: '开局', v: '15天+断货赔付', why: '生死线' },
      { s: '让步', v: '15天+赔付封顶', why: '可接受' },
      { s: '底线', v: '20天+赔付', why: '勉强' },
      { s: '红线', v: '"特殊工艺除外"无具体清单', why: '万能借口' }
    ],
    tradeoffs: ['赔付上限', '特殊清单范围', '产能档位'],
    redLine: '无时效约束 / "特殊工艺除外"模糊条款 → 退出'
  },
  {
    id: 11, code: '10.1', icon: '🏆', title: '独享品认定与保护期', importance: '极高',
    opening: '满足以下任一条件即为乙方独享品：①乙方测出且首推（首发30天内）；②乙方渠道数据领先其他渠道30%以上，持续2周。独享期12个月，包含传统电商优先经营权。',
    counters: [
      { t: '"都给乙方独享，其他渠道还做不做"', o: '独享≠不让其他渠道卖，可以约定：其他渠道售价不得低于乙方价。您仍通过分成全额获利。' },
      { t: '"12个月太长，市场会变"', o: '直播爆款生命周期通常6-18个月，12个月是合理保护期。可以约定"达到累计GMV X万元后自动解除"。' },
      { t: '"30%数据领先门槛太低"', o: '30%+持续2周已经是显著领先。如果担心数据噪音，可以约定第三方数据采信（蝉妈妈/蝉魔方）。' }
    ],
    path: [
      { s: '开局', v: '12月独享+传统电商权', why: '激励测款' },
      { s: '让步', v: '12月独享', why: '可接受' },
      { s: '底线', v: '6月独享', why: '勉强' },
      { s: '红线', v: '无独享', why: '测款积极性归零' }
    ],
    tradeoffs: ['独享期长度', '其他渠道限价', '传统电商权'],
    redLine: '拒绝任何形式独享保护 → 测款积极性归零'
  },
  {
    id: 12, code: '11.x', icon: '🏛️', title: '合资公司触发与治理（最重要！）', importance: '战略级',
    opening: '当乙方达成首年保底GMV+次年目标的80%时，自动启动合资公司谈判，90天内完成成立。乙方持股不低于40%，派驻COO主导日常运营。该条款必须写入首份合同，不接受"长远考虑"的口头承诺。',
    counters: [
      { t: '"合资可以未来再谈"', o: '陈总，没有合资条款写入首份合同，乙方就无法做长期投入——团队、达人孵化、品牌建设都是3年以上的回报周期。这是这次谈判最关键的条款，是底线中的底线。' },
      { t: '"40%股权太高"', o: '乙方贡献的是运营组织+达人资源+直播电商know-how+已建立的数据壁垒，参照"工业品牌+互联网运营"合资标准，40%是合理的。我方甚至可以接受甲方控股51%，但乙方需要董事会一票否决权。' },
      { t: '"乙方派COO太强势"', o: '日常运营的实际控制权必须在乙方——这是合资公司能否高效运转的关键。甲方派CEO、董事长，掌握战略方向；乙方派COO，执行日常运营。分工清晰。' }
    ],
    path: [
      { s: '开局', v: '自动触发+40%+COO+一票否决', why: '深度绑定' },
      { s: '让步', v: '自动触发+40%+COO', why: '保留核心' },
      { s: '让步', v: '协商触发+35%+COO', why: '勉强' },
      { s: '底线', v: '协商触发+30%+运营总监', why: '最低保障' },
      { s: '红线', v: '只是"长远考虑"无任何条款', why: '退出' }
    ],
    tradeoffs: ['股权比例', '高管派驻级别', '业务范围(兴趣电商/全电商/全渠道)', '触发条件松紧'],
    redLine: '甲方拒绝将合资条款写入首份合同 → 退出谈判（这是底线中的底线）'
  }
];

const ImportanceBadge = ({ level }: { level: string }) => {
  const styles: Record<string, string> = {
    '决定性': 'bg-red-950 text-red-300 border-red-800',
    '战略级': 'bg-purple-950 text-purple-300 border-purple-800',
    '极高': 'bg-orange-950 text-orange-300 border-orange-800',
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${styles[level]}`}>{level}</span>;
};

function ScriptCard({ script, isOpen, onToggle }: { script: typeof scripts[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-850 transition text-left"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-xl">{script.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-zinc-500">#{script.id} · {script.code}</span>
              <ImportanceBadge level={script.importance} />
            </div>
            <div className="font-semibold text-zinc-100 mt-0.5 truncate">{script.title}</div>
          </div>
        </div>
        {isOpen ? <ChevronDown size={18} className="text-zinc-400 flex-shrink-0"/> : <ChevronRight size={18} className="text-zinc-400 flex-shrink-0"/>}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-2 space-y-4 border-t border-zinc-800">
          {/* 开局话术 */}
          <div className="bg-blue-950 border-l-4 border-blue-600 rounded p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Swords size={14} className="text-blue-400"/>
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">开局锚点话术</span>
            </div>
            <p className="text-sm text-blue-100 leading-relaxed">{script.opening}</p>
          </div>

          {/* 反驳 + 应对 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={14} className="text-amber-400"/>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">甲方典型反驳 → 我方应对</span>
            </div>
            <div className="space-y-2">
              {script.counters.map((c, i) => (
                <div key={i} className="bg-zinc-950 border border-zinc-800 rounded p-3">
                  <div className="text-xs text-red-300 mb-1.5 italic">甲方：{c.t}</div>
                  <div className="text-sm text-emerald-200">↳ 我方：{c.o}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 让步路径 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={14} className="text-purple-400"/>
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">让步路径图</span>
            </div>
            <div className="space-y-1.5">
              {script.path.map((p, i) => {
                const isRed = p.s.includes('红线');
                const isBottom = p.s.includes('底线');
                return (
                  <div key={i} className={`flex items-start gap-2 rounded p-2 ${isRed ? 'bg-red-950 border border-red-800' : isBottom ? 'bg-orange-950 border border-orange-800' : 'bg-zinc-950 border border-zinc-800'}`}>
                    <span className="font-mono text-xs text-zinc-500 w-6 mt-0.5">{i+1}.</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold ${isRed ? 'text-red-300' : isBottom ? 'text-orange-300' : 'text-zinc-200'}`}>{p.s}</span>
                        <span className={`font-mono text-sm ${isRed ? 'text-red-200' : isBottom ? 'text-orange-200' : 'text-emerald-300'}`}>{p.v}</span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">{p.why}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 交换筹码 */}
          <div className="bg-zinc-950 border border-zinc-800 rounded p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Target size={14} className="text-cyan-400"/>
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">可交换筹码</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {script.tradeoffs.map((t, i) => (
                <span key={i} className="text-xs bg-cyan-950 text-cyan-200 border border-cyan-900 rounded px-2 py-0.5">{t}</span>
              ))}
            </div>
          </div>

          {/* 红线 */}
          <div className="bg-red-950 border-l-4 border-red-600 rounded p-3">
            <div className="flex items-center gap-2 mb-1">
              <Flag size={14} className="text-red-400"/>
              <span className="text-xs font-bold text-red-300 uppercase tracking-wider">红线（不可让步）</span>
            </div>
            <p className="text-sm text-red-200">{script.redLine}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const fmt = (n: number) => n.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
const fmtW = (n: number) => (n / 10000).toFixed(1) + '万';

function SliderInput({ label, value, onChange, min, max, step, format }: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs text-zinc-400">{label}</label>
        <span className="text-sm font-mono font-semibold text-emerald-300">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  const colors: Record<string, string> = {
    zinc: 'border-zinc-800',
    blue: 'border-blue-800',
    orange: 'border-orange-800',
  };
  return (
    <div className={`bg-zinc-900 border ${colors[color]} rounded p-3`}>
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-lg font-bold text-zinc-100 mt-0.5">{value}</div>
      <div className="text-xs text-zinc-500 mt-0.5">{sub}</div>
    </div>
  );
}

function Row({ label, value, color, bold }: { label: string; value: number; color?: string; bold?: boolean }) {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-300',
    red: 'text-red-300',
  };
  const isNeg = value < 0;
  return (
    <div className="flex justify-between items-center">
      <span className={`text-zinc-300 ${bold ? 'font-bold' : ''}`}>{label}</span>
      <span className={`font-mono ${bold ? (value >= 0 ? 'text-emerald-300 text-lg font-bold' : 'text-red-300 text-lg font-bold') : (color ? colorMap[color] : 'text-zinc-200')}`}>
        {isNeg ? '-' : ''}¥{fmt(Math.abs(value))}
      </span>
    </div>
  );
}

function FinancialModel() {
  const [gmv, setGmv] = useState(10000000);
  const [returnRate, setReturnRate] = useState(50);
  const [floor, setFloor] = useState(80);
  const [sell, setSell] = useState(200);
  const [yiSplit, setYiSplit] = useState(50);
  const [roi, setRoi] = useState(8);
  const [roiBasis, setRoiBasis] = useState<'gross' | 'net'>('gross');
  const [opCost, setOpCost] = useState(110000);
  const [adSplit, setAdSplit] = useState(50);
  const [platFee, setPlatFee] = useState(5);

  const calc = (overrides: Record<string, number> = {}) => {
    const G = overrides.gmv ?? gmv;
    const R = (overrides.returnRate ?? returnRate) / 100;
    const F = overrides.floor ?? floor;
    const S = overrides.sell ?? sell;
    const Y = (overrides.yiSplit ?? yiSplit) / 100;
    const RO = overrides.roi ?? roi;
    const OP = (overrides.opCost ?? opCost) * 12;
    const AS = (overrides.adSplit ?? adSplit) / 100;
    const PF = (overrides.platFee ?? platFee) / 100;

    const grossUnits = G / S;
    const realUnits = grossUnits * (1 - R);
    const realGMV = realUnits * S;
    const margin = S - F;
    const totalMargin = realUnits * margin;
    const adSpend = (roiBasis === 'gross' ? G : realGMV) / RO;
    const platTotal = realGMV * PF;

    const yiShare = totalMargin * Y;
    const jiaShare = totalMargin * (1 - Y);
    const yiAd = adSpend * AS;
    const jiaAd = adSpend * (1 - AS);

    const yiNet = yiShare - yiAd - OP;
    const jiaNet = jiaShare - jiaAd - platTotal;

    return { grossUnits, realUnits, realGMV, totalMargin, adSpend, platTotal, yiShare, jiaShare, yiAd, jiaAd, yiNet, jiaNet, OP };
  };

  const r = useMemo(() => calc(), [gmv, returnRate, floor, sell, yiSplit, roi, opCost, adSplit, platFee, roiBasis]);

  const splitSensitivity = useMemo(() => {
    return [40, 45, 50, 55, 60, 65, 70].map(s => {
      const c = calc({ yiSplit: s });
      return { split: s + '%', '乙方净利润': Math.round(c.yiNet / 10000), '甲方净利润': Math.round(c.jiaNet / 10000) };
    });
  }, [gmv, returnRate, floor, sell, roi, opCost, adSplit, platFee, roiBasis]);

  const gmvSensitivity = useMemo(() => {
    return [500, 800, 1000, 1200, 1500, 2000, 2500, 3000].map(g => {
      const c = calc({ gmv: g * 10000 });
      return { gmv: g + '万', '乙方净利润': Math.round(c.yiNet / 10000), '甲方净利润': Math.round(c.jiaNet / 10000) };
    });
  }, [returnRate, floor, sell, yiSplit, roi, opCost, adSplit, platFee, roiBasis]);

  const breakEvenGMV = useMemo(() => {
    const Y = yiSplit / 100;
    const AS = adSplit / 100;
    const R = returnRate / 100;
    const realRatio = (1 - R);
    const marginRatio = (sell - floor) / sell;
    const adRatio = 1 / roi;
    const OP = opCost * 12;
    if (roiBasis === 'gross') {
      const k = realRatio * marginRatio * Y - adRatio * AS;
      return k > 0 ? OP / k : null;
    } else {
      const k = realRatio * (marginRatio * Y - adRatio * AS);
      return k > 0 ? OP / k : null;
    }
  }, [yiSplit, adSplit, returnRate, sell, floor, roi, opCost, roiBasis]);

  const breakEvenSplit = useMemo(() => {
    const AS = adSplit / 100;
    const OP = opCost * 12;
    if (r.totalMargin <= 0) return null;
    const Y = (r.adSpend * AS + OP) / r.totalMargin;
    return Y * 100;
  }, [r, adSplit, opCost]);

  const yiLossWarning = r.yiNet < 0;

  return (
    <div className="space-y-4">
      {yiLossWarning && (
        <div className="bg-red-950 border-l-4 border-red-500 rounded p-4 animate-pulse">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={20}/>
            <div>
              <div className="font-bold text-red-200 mb-1">⚠️ 严重警告：当前参数下乙方年净亏 {fmtW(Math.abs(r.yiNet))}元</div>
              <div className="text-sm text-red-300">
                按此方案签约即陪跑亏损。建议：①分成提升至 <span className="font-bold text-red-100">{breakEvenSplit ? breakEvenSplit.toFixed(1)+'%' : 'N/A'}</span> 以上保本，或 ②GMV做到 <span className="font-bold text-red-100">{breakEvenGMV ? fmtW(breakEvenGMV) : 'N/A'}</span> 以上保本，或 ③要求甲方分担运营成本。
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calculator size={16} className="text-blue-400"/>
          <span className="font-semibold text-zinc-100">输入参数（可拖动滑块调整）</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SliderInput label="年度GMV（成交，元）" value={gmv} onChange={setGmv} min={1000000} max={50000000} step={500000} format={fmtW}/>
          <SliderInput label="退货率 (%)" value={returnRate} onChange={setReturnRate} min={10} max={70} step={5} format={v=>v+'%'}/>
          <SliderInput label="产品底价（元/件）" value={floor} onChange={setFloor} min={20} max={200} step={5} format={v=>'¥'+v}/>
          <SliderInput label="直播售价（元/件）" value={sell} onChange={setSell} min={50} max={500} step={10} format={v=>'¥'+v}/>
          <SliderInput label="乙方分成比例 (%)" value={yiSplit} onChange={setYiSplit} min={30} max={70} step={1} format={v=>v+'%'}/>
          <SliderInput label="乙方投流分担 (%)" value={adSplit} onChange={setAdSplit} min={0} max={100} step={5} format={v=>v+'%'}/>
          <SliderInput label="投流ROI" value={roi} onChange={setRoi} min={3} max={20} step={0.5} format={v=>v.toFixed(1)}/>
          <SliderInput label="月运营成本（元）" value={opCost} onChange={setOpCost} min={30000} max={500000} step={10000} format={v=>fmtW(v)+'/月'}/>
          <SliderInput label="平台扣点 (%)" value={platFee} onChange={setPlatFee} min={0} max={10} step={0.5} format={v=>v+'%'}/>
          <div>
            <label className="text-xs text-zinc-400 block mb-1">ROI计算基数</label>
            <div className="flex gap-2">
              <button onClick={()=>setRoiBasis('gross')} className={`flex-1 px-3 py-1.5 rounded text-xs ${roiBasis==='gross'?'bg-blue-700 text-white':'bg-zinc-800 text-zinc-300'}`}>成交GMV（行业标准）</button>
              <button onClick={()=>setRoiBasis('net')} className={`flex-1 px-3 py-1.5 rounded text-xs ${roiBasis==='net'?'bg-blue-700 text-white':'bg-zinc-800 text-zinc-300'}`}>实收GMV</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="实销件数" value={fmt(r.realUnits)+'件'} sub={`成交件数 ${fmt(r.grossUnits)}件`} color="zinc"/>
        <StatCard label="实收GMV" value={'¥'+fmtW(r.realGMV)} sub={`退货损失 ${fmtW(gmv - r.realGMV)}`} color="zinc"/>
        <StatCard label="可分配毛利" value={'¥'+fmtW(r.totalMargin)} sub={`单件 ¥${sell-floor}`} color="blue"/>
        <StatCard label="投流总成本" value={'¥'+fmtW(r.adSpend)} sub={`ROI ${roi}（基于${roiBasis==='gross'?'成交':'实收'}）`} color="orange"/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`border rounded-lg p-4 ${r.yiNet>=0?'bg-emerald-950 border-emerald-800':'bg-red-950 border-red-800'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-zinc-300 font-bold">乙方（我方）</span>
            </div>
            {r.yiNet>=0 ? <TrendingUp className="text-emerald-400" size={18}/> : <TrendingDown className="text-red-400" size={18}/>}
          </div>
          <div className="space-y-1.5 text-sm">
            <Row label="毛利分成" value={r.yiShare} color="emerald"/>
            <Row label="投流分担" value={-r.yiAd} color="red"/>
            <Row label="年运营成本" value={-r.OP} color="red"/>
            <div className="border-t border-zinc-700 pt-2 mt-2">
              <Row label="年度净利润" value={r.yiNet} bold/>
              <div className="text-xs text-zinc-400 mt-1">月均利润：¥{fmt(r.yiNet/12)}</div>
              <div className="text-xs text-zinc-400">毛利率（vs实收GMV）：{((r.yiNet/r.realGMV)*100).toFixed(1)}%</div>
            </div>
          </div>
        </div>

        <div className={`border rounded-lg p-4 ${r.jiaNet>=0?'bg-blue-950 border-blue-800':'bg-red-950 border-red-800'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-300 font-bold">甲方（品牌方）</span>
            {r.jiaNet>=0 ? <TrendingUp className="text-blue-400" size={18}/> : <TrendingDown className="text-red-400" size={18}/>}
          </div>
          <div className="space-y-1.5 text-sm">
            <Row label="毛利分成" value={r.jiaShare} color="emerald"/>
            <Row label="投流分担" value={-r.jiaAd} color="red"/>
            <Row label="平台扣点" value={-r.platTotal} color="red"/>
            <div className="border-t border-zinc-700 pt-2 mt-2">
              <Row label="年度净利润" value={r.jiaNet} bold/>
              <div className="text-xs text-zinc-400 mt-1">月均利润：¥{fmt(r.jiaNet/12)}</div>
              <div className="text-xs text-zinc-400">备注：未计入退货物流/库存损失</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target size={16} className="text-purple-400"/>
          <span className="font-semibold text-zinc-100">盈亏平衡分析（乙方视角）</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-zinc-950 border border-zinc-800 rounded p-3">
            <div className="text-xs text-zinc-500 mb-1">在当前GMV下，乙方分成需达到</div>
            <div className="text-2xl font-bold text-purple-300">{breakEvenSplit ? breakEvenSplit.toFixed(1)+'%' : 'N/A'}</div>
            <div className="text-xs text-zinc-400 mt-1">才能保本（当前 {yiSplit}%）</div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded p-3">
            <div className="text-xs text-zinc-500 mb-1">在当前分成比例下，GMV需达到</div>
            <div className="text-2xl font-bold text-purple-300">{breakEvenGMV ? fmtW(breakEvenGMV) : 'N/A'}</div>
            <div className="text-xs text-zinc-400 mt-1">才能保本（当前 {fmtW(gmv)}）</div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="text-sm font-semibold text-zinc-100 mb-2">📊 分成比例敏感性（其他参数不变，单位：万元）</div>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={splitSensitivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>
              <XAxis dataKey="split" stroke="#a1a1aa" tick={{fontSize:11}}/>
              <YAxis stroke="#a1a1aa" tick={{fontSize:11}}/>
              <Tooltip contentStyle={{background:'#18181b',border:'1px solid #3f3f46',borderRadius:'6px'}}/>
              <Legend wrapperStyle={{fontSize:'12px'}}/>
              <ReferenceLine y={0} stroke="#ef4444" strokeWidth={2}/>
              <Bar dataKey="乙方净利润" fill="#10b981"/>
              <Bar dataKey="甲方净利润" fill="#3b82f6"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="text-sm font-semibold text-zinc-100 mb-2">📈 GMV规模敏感性（其他参数不变，单位：万元）</div>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={gmvSensitivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>
              <XAxis dataKey="gmv" stroke="#a1a1aa" tick={{fontSize:11}}/>
              <YAxis stroke="#a1a1aa" tick={{fontSize:11}}/>
              <Tooltip contentStyle={{background:'#18181b',border:'1px solid #3f3f46',borderRadius:'6px'}}/>
              <Legend wrapperStyle={{fontSize:'12px'}}/>
              <ReferenceLine y={0} stroke="#ef4444" strokeWidth={2}/>
              <Line type="monotone" dataKey="乙方净利润" stroke="#10b981" strokeWidth={2} dot={{r:4}}/>
              <Line type="monotone" dataKey="甲方净利润" stroke="#3b82f6" strokeWidth={2} dot={{r:4}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-950 to-zinc-900 border border-purple-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} className="text-purple-300"/>
          <span className="font-bold text-purple-200">基于当前数据的谈判结论</span>
        </div>
        <ol className="space-y-2 text-sm text-zinc-200 list-decimal list-inside">
          <li>当前参数（1000万GMV/50%退货/50:50分成/ROI 8/月运营11万）下乙方<span className="font-bold text-red-300">年亏约{fmtW(Math.abs(r.yiNet))}</span>，方案不可签。</li>
          <li>必须满足以下三个条件中至少两个：①分成提升至 <span className="font-bold text-emerald-300">{breakEvenSplit ? breakEvenSplit.toFixed(0)+'%以上' : 'N/A'}</span>；②首年GMV目标提升至 <span className="font-bold text-emerald-300">{breakEvenGMV ? fmtW(breakEvenGMV)+'以上' : 'N/A'}</span>；③甲方承担月运营成本的一部分。</li>
          <li>建议把 <span className="font-bold text-purple-200">"50%退货率"</span> 作为风险共担条款写入合同——退货率高于X%时触发分成重谈机制。</li>
          <li>ROI 8 在抖音服饰类目偏乐观，建议同步约定 <span className="font-bold text-purple-200">"ROI不达6时甲方分担投流"</span> 的对冲条款。</li>
          <li>甲方在该方案下年利润约 <span className="font-bold text-blue-300">{fmtW(Math.max(0,r.jiaNet))}</span>，加上产品端的隐性利润（生产毛利已含在底价80元中），实际更高。我方有理由要求更高分成。</li>
        </ol>
      </div>
    </div>
  );
}

export default function NegotiationTool() {
  const [tab, setTab] = useState<'A' | 'B'>('A');
  const [openCards, setOpenCards] = useState<Record<number, boolean>>({ 1: true });

  const toggle = (id: number) => setOpenCards(prev => ({ ...prev, [id]: !prev[id] }));
  const openAll = () => setOpenCards(Object.fromEntries(scripts.map(s => [s.id, true])));
  const closeAll = () => setOpenCards({});

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-zinc-50 mb-1">Dickies 谈判作战包</h1>
        <p className="text-sm text-zinc-400">A·12条核心话术 + B·财务测算模型</p>
      </div>

      <div className="flex gap-2 mb-4 border-b border-zinc-800">
        <button
          onClick={()=>setTab('A')}
          className={`px-4 py-2 text-sm font-semibold transition border-b-2 ${tab==='A'?'border-blue-500 text-blue-300':'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          <BookOpen size={14} className="inline mr-1.5"/>A · 谈判话术作战手册
        </button>
        <button
          onClick={()=>setTab('B')}
          className={`px-4 py-2 text-sm font-semibold transition border-b-2 ${tab==='B'?'border-blue-500 text-blue-300':'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          <Calculator size={14} className="inline mr-1.5"/>B · 财务测算模型
        </button>
      </div>

      {tab === 'A' && (
        <div className="space-y-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded p-3 flex items-center justify-between flex-wrap gap-2">
            <div className="text-xs text-zinc-400">
              共 <span className="font-bold text-zinc-200">{scripts.length}</span> 条核心议题 · 每条含开局话术、反驳应对、让步路径、交换筹码、红线
            </div>
            <div className="flex gap-2">
              <button onClick={openAll} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1 rounded">全部展开</button>
              <button onClick={closeAll} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1 rounded">全部折叠</button>
            </div>
          </div>

          {scripts.map(s => (
            <ScriptCard key={s.id} script={s} isOpen={!!openCards[s.id]} onToggle={()=>toggle(s.id)}/>
          ))}

          <div className="bg-gradient-to-br from-amber-950 to-zinc-900 border border-amber-800 rounded-lg p-4 mt-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-amber-300"/>
              <span className="font-bold text-amber-200">⚡ 谈判节奏建议</span>
            </div>
            <ol className="space-y-1.5 text-sm text-zinc-200 list-decimal list-inside">
              <li><span className="font-semibold text-amber-200">先谈方向，后谈利益：</span>第一次会面先把"联营+合资蓝图"画清楚（条款#12），让甲方对长期价值有感知，再谈分成。</li>
              <li><span className="font-semibold text-amber-200">捆绑议题，不要单条让步：</span>"我在分成上让1%，您必须在审计权或独享期上让步"——永远成对让步。</li>
              <li><span className="font-semibold text-amber-200">先易后难：</span>从条款#5（结算）、#7（成本透明）这些"看似可谈"的开始，建立互信节奏，再攻#1（分成）和#12（合资）。</li>
              <li><span className="font-semibold text-amber-200">数据是最大筹码：</span>把财务模型（Tab B）打印出来，分成谈判时直接演算给对方看——"50/50我亏45万，请问您怎么解决"。</li>
              <li><span className="font-semibold text-amber-200">合资条款必须首签：</span>这是底线中的底线，不写入首份合同，宁愿不签。</li>
            </ol>
          </div>
        </div>
      )}

      {tab === 'B' && <FinancialModel/>}
    </div>
  );
}
