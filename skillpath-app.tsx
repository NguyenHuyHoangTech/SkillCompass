"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Compass,
  FlaskConical,
  LogOut,
  Plus,
  ShieldCheck,
  Target,
  UserRound,
} from "lucide-react";
import { LoginScreen, useDemoAuth } from "./auth";
import {
  careerProfile,
  careerScenario,
  createId,
  goalLabels,
  normalize,
  questionFor,
  skillGroups,
  suggestedRoadmap,
  type ClaimedSkill,
  type GoalType,
  type ProfileInput,
  type SkillCategory,
  type Step,
} from "./demo-data";
import { RoadmapView } from "./roadmap-view";

const steps = [
  "Hồ sơ mục tiêu",
  "Kỹ năng hiện có",
  "Xác nhận phạm vi",
  "Đánh giá năng lực",
  "Lộ trình",
];
const titles = [
  "Xác định mục tiêu nghề nghiệp",
  "Ghi nhận năng lực hiện có",
  "Xác nhận bản đồ kỹ năng",
  "Đánh giá qua tình huống",
  "Lộ trình dành cho bạn",
];
const descriptions = [
  "Xác định đích đến, thời gian và nhịp học phù hợp với mục tiêu của bạn.",
  "Chọn kỹ năng bạn đã từng sử dụng và tự đánh giá mức hiện tại từ 1 đến 5.",
  "Kiểm tra những năng lực cần thiết cho mục tiêu nghề nghiệp của bạn.",
  "Trả lời từng tình huống. Rubric được hiển thị trước để bạn biết tiêu chí đánh giá.",
  "Tập trung vào những kỹ năng cần cải thiện để tiến gần hơn đến mục tiêu.",
];
const categoryLabels: Record<SkillCategory, string> = {
  core: "Năng lực cốt lõi",
  supporting: "Năng lực hỗ trợ",
  ai: "Năng lực thời đại AI",
};
type Answer = { text: string; submitted: boolean; dontKnow: boolean };
const initialProfile: ProfileInput = {
  career: "",
  country: "Việt Nam",
  goalType: "internship",
  weeklyHours: 8,
  deadline: "",
};

export function SkillPathApp() {
  const auth = useDemoAuth();
  const [step, setStep] = useState<Step>(1);
  const [profile, setProfile] = useState<ProfileInput>(initialProfile);
  const [claimed, setClaimed] = useState<ClaimedSkill[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [excludedIds, setExcludedIds] = useState<string[]>([]);
  const [assessmentIndex, setAssessmentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [sandboxOpen, setSandboxOpen] = useState(false);
  const [scenarioChoice, setScenarioChoice] = useState<number | null>(null);
  const [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const target = useMemo(() => careerProfile(profile.career), [profile.career]);
  const includedIds = target.skills
    .filter((skill) => !excludedIds.includes(skill.id))
    .map((skill) => skill.id);
  const roadmap = suggestedRoadmap(profile, claimed, target, includedIds);
  const currentSkill = claimed[assessmentIndex];
  const question = currentSkill ? questionFor(currentSkill) : null;
  const answer = currentSkill
    ? (answers[currentSkill.id] ?? {
        text: "",
        submitted: false,
        dontKnow: false,
      })
    : null;
  const scenario = careerScenario(profile.career);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
    window.scrollTo(0, 0);
  }, [step, assessmentIndex]);

  function go(next: Step) {
    setError("");
    setStep(next);
  }
  function updateProfile<Key extends keyof ProfileInput>(
    key: Key,
    value: ProfileInput[Key],
  ) {
    setProfile((previous) => ({ ...previous, [key]: value }));
    setError("");
  }
  function validateProfile() {
    if (!profile.career.trim()) {
      setError("Nhập nghề nghiệp mục tiêu.");
      return;
    }
    if (!profile.deadline) {
      setError("Chọn thời hạn bạn muốn đạt mục tiêu.");
      return;
    }
    if (profile.weeklyHours < 1 || profile.weeklyHours > 60) {
      setError("Thời gian học cần nằm trong khoảng 1–60 giờ mỗi tuần.");
      return;
    }
    setExcludedIds([]);
    go(2);
  }
  function toggleClaimed(name: string) {
    setClaimed((previous) => {
      const existing = previous.find(
        (item) => normalize(item.name) === normalize(name),
      );
      return existing
        ? previous.filter((item) => item.id !== existing.id)
        : [...previous, { id: createId(), name, level: 3 }];
    });
  }
  function setSkillLevel(id: string, level: number) {
    setClaimed((previous) =>
      previous.map((item) => (item.id === id ? { ...item, level } : item)),
    );
  }
  function addCustomSkill() {
    const name = customSkill.trim();
    if (!name) {
      setError("Nhập tên kỹ năng muốn thêm.");
      return;
    }
    if (claimed.some((item) => normalize(item.name) === normalize(name))) {
      setError("Kỹ năng này đã có trong hồ sơ.");
      return;
    }
    setClaimed((previous) => [...previous, { id: createId(), name, level: 3 }]);
    setCustomSkill("");
    setError("");
  }
  function finishSkills() {
    setAssessmentIndex(0);
    setAnswers({});
    go(3);
  }
  function saveAnswer(dontKnow = false) {
    if (!currentSkill || !answer || (!dontKnow && !answer.text.trim())) return;
    setAnswers((previous) => ({
      ...previous,
      [currentSkill.id]: {
        text: dontKnow ? "" : answer.text,
        submitted: true,
        dontKnow,
      },
    }));
  }
  function reset() {
    setStep(1);
    setProfile(initialProfile);
    setClaimed([]);
    setCustomSkill("");
    setExcludedIds([]);
    setAssessmentIndex(0);
    setAnswers({});
    setSandboxOpen(false);
    setScenarioChoice(null);
    setError("");
  }
  if (!auth.session) return <LoginScreen onLogin={auth.login} />;

  return (
    <div className="sp-app">
      <a className="sp-skip" href="#content">
        Đến nội dung chính
      </a>
      <header className="sp-header">
        <div className="sp-brand">
          <span>
            <Compass size={21} />
          </span>
          <strong>SkillCompass</strong>
        </div>
        <nav aria-label="Tiến trình thiết lập lộ trình">
          <ol className="sp-steps">
            {steps.map((label, index) => (
              <li
                key={label}
                aria-current={step === index + 1 ? "step" : undefined}
              >
                <span className="sp-step-number">
                  {index + 1 < step ? (
                    <Check size={13} aria-label="Đã hoàn thành" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span>{label}</span>
                {index < steps.length - 1 && (
                  <ChevronRight className="sp-chevron" size={13} />
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className="sp-account">
          <span title={auth.session.email}>
            <UserRound size={15} />
            {auth.session.displayName}
          </span>
          <button onClick={auth.logout}>
            <LogOut size={15} />
            Đăng xuất
          </button>
        </div>
      </header>
      <main id="content" className={`sp-main ${step === 5 ? "sp-wide" : ""}`}>
        <div className="sp-heading">
          <p className="sp-eyebrow">
            BƯỚC {String(step).padStart(2, "0")} / 05
          </p>
          <h1 ref={heading} tabIndex={-1}>
            {titles[step - 1]}
          </h1>
          <p>{descriptions[step - 1]}</p>
        </div>

        {step === 1 && (
          <section className="sp-profile-shell">
            <div className="sp-profile-intro">
              <span className="sp-intro-icon">
                <Target size={25} />
              </span>
              <p className="sp-eyebrow">HỒ SƠ ĐỊNH HƯỚNG</p>
              <h2>Một lộ trình tốt bắt đầu từ mục tiêu rõ ràng.</h2>
              <p>
                Hãy chia sẻ hướng nghề nghiệp và quỹ thời gian để xây dựng kế
                hoạch học tập phù hợp với bạn.
              </p>
            </div>
            <form
              className="sp-card sp-profile-form"
              onSubmit={(event) => {
                event.preventDefault();
                validateProfile();
              }}
            >
              <div className="sp-field sp-field-full">
                <label htmlFor="career">Nghề nghiệp mục tiêu</label>
                <input
                  id="career"
                  value={profile.career}
                  onChange={(e) => updateProfile("career", e.target.value)}
                  placeholder="Ví dụ: Frontend Developer"
                  list="careers"
                  maxLength={100}
                />
                <datalist id="careers">
                  <option>Frontend Developer</option>
                  <option>Data Analyst</option>
                  <option>Digital Marketing Specialist</option>
                </datalist>
              </div>
              <div className="sp-field">
                <label htmlFor="country">Quốc gia / bối cảnh</label>
                <input
                  id="country"
                  value={profile.country}
                  onChange={(e) => updateProfile("country", e.target.value)}
                  placeholder="Ví dụ: Việt Nam"
                  maxLength={80}
                />
              </div>
              <div className="sp-field">
                <label htmlFor="goal">Loại mục tiêu</label>
                <select
                  id="goal"
                  value={profile.goalType}
                  onChange={(e) =>
                    updateProfile("goalType", e.target.value as GoalType)
                  }
                >
                  {Object.entries(goalLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sp-field">
                <label htmlFor="hours">Thời gian học mỗi tuần</label>
                <div className="sp-input-suffix">
                  <input
                    id="hours"
                    type="number"
                    min={1}
                    max={60}
                    value={profile.weeklyHours}
                    onChange={(e) =>
                      updateProfile("weeklyHours", Number(e.target.value))
                    }
                  />
                  <span>giờ</span>
                </div>
              </div>
              <div className="sp-field">
                <label htmlFor="deadline">Thời hạn mục tiêu</label>
                <input
                  id="deadline"
                  type="date"
                  value={profile.deadline}
                  onChange={(e) => updateProfile("deadline", e.target.value)}
                />
              </div>
              {error && (
                <p className="sp-error sp-field-full" role="alert">
                  {error}
                </p>
              )}
              <div className="sp-actions sp-field-full">
                <span className="sp-muted">
                  Có thể điều chỉnh lại trước khi tạo roadmap.
                </span>
                <button className="sp-primary" type="submit">
                  Tiếp tục <ArrowRight size={17} />
                </button>
              </div>
            </form>
          </section>
        )}

        {step === 2 && (
          <section className="sp-card">
            <div className="sp-section-lead">
              <div>
                <p className="sp-eyebrow">TỰ KHAI BÁO</p>
                <h2>Bạn đã từng sử dụng kỹ năng nào?</h2>
              </div>
              <span className="sp-count-chip">{claimed.length} kỹ năng</span>
            </div>
            {skillGroups.map((group) => (
              <fieldset className="sp-group" key={group.title}>
                <legend>{group.title}</legend>
                <div className="sp-skill-grid">
                  {group.skills.map((name) => {
                    const selected = claimed.find(
                      (item) => normalize(item.name) === normalize(name),
                    );
                    return (
                      <div
                        className={`sp-skill-select ${selected ? "selected" : ""}`}
                        key={name}
                      >
                        <button
                          type="button"
                          aria-pressed={Boolean(selected)}
                          onClick={() => toggleClaimed(name)}
                        >
                          <span>{selected && <Check size={14} />}</span>
                          {name}
                        </button>
                        {selected && (
                          <label>
                            Mức hiện tại{" "}
                            <select
                              aria-label={`Mức hiện tại của ${name}`}
                              value={selected.level}
                              onChange={(e) =>
                                setSkillLevel(
                                  selected.id,
                                  Number(e.target.value),
                                )
                              }
                            >
                              {[1, 2, 3, 4, 5].map((level) => (
                                <option key={level} value={level}>
                                  {level}/5
                                </option>
                              ))}
                            </select>
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            ))}
            {claimed
              .filter(
                (item) =>
                  !skillGroups
                    .flatMap((group) => group.skills)
                    .some((name) => normalize(name) === normalize(item.name)),
              )
              .map((item) => (
                <div className="sp-custom-row" key={item.id}>
                  <strong>{item.name}</strong>
                  <label>
                    Mức hiện tại{" "}
                    <select
                      aria-label={`Mức hiện tại của ${item.name}`}
                      value={item.level}
                      onChange={(e) =>
                        setSkillLevel(item.id, Number(e.target.value))
                      }
                    >
                      {[1, 2, 3, 4, 5].map((level) => (
                        <option key={level} value={level}>
                          {level}/5
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleClaimed(item.name)}
                  >
                    Bỏ
                  </button>
                </div>
              ))}
            <form
              className="sp-add"
              onSubmit={(e) => {
                e.preventDefault();
                addCustomSkill();
              }}
            >
              <label className="sp-sr" htmlFor="custom-skill">
                Kỹ năng khác
              </label>
              <input
                id="custom-skill"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Thêm kỹ năng khác"
                maxLength={80}
              />
              <button className="sp-secondary" type="submit">
                <Plus size={16} />
                Thêm
              </button>
            </form>
            {error && (
              <p className="sp-error" role="alert">
                {error}
              </p>
            )}
            <div className="sp-actions">
              <button className="sp-back" onClick={() => go(1)}>
                <ArrowLeft size={16} />
                Quay lại
              </button>
              <button className="sp-primary" onClick={finishSkills}>
                {claimed.length ? "Xác nhận kỹ năng" : "Tôi chưa có kỹ năng"}
                <ArrowRight size={17} />
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="sp-card">
            <div className="sp-career-profile-head">
              <span>
                <BriefcaseBusiness size={21} />
              </span>
              <div>
                <p className="sp-eyebrow">BẢN ĐỒ KỸ NĂNG MỤC TIÊU</p>
                <h2>{target.title}</h2>
                <p>{target.description}</p>
              </div>
            </div>
            <div className="sp-scope-note">
              <ShieldCheck size={18} />
              <p>
                <strong>Hãy kiểm tra danh sách.</strong> Đánh dấu “Không phù
                hợp” nếu kỹ năng không thuộc mục tiêu của bạn.
              </p>
            </div>
            {(Object.keys(categoryLabels) as SkillCategory[]).map(
              (category) => (
                <div className="sp-target-group" key={category}>
                  <div className="sp-target-group-title">
                    <h3>{categoryLabels[category]}</h3>
                    <span>
                      {
                        target.skills.filter(
                          (skill) =>
                            skill.category === category &&
                            !excludedIds.includes(skill.id),
                        ).length
                      }{" "}
                      được chọn
                    </span>
                  </div>
                  {target.skills
                    .filter((skill) => skill.category === category)
                    .map((skill) => {
                      const excluded = excludedIds.includes(skill.id);
                      return (
                        <article
                          className={`sp-target-skill ${excluded ? "excluded" : ""}`}
                          key={skill.id}
                        >
                          <div>
                            <strong>{skill.name}</strong>
                            <p>{skill.reason}</p>
                            <small>
                              {skill.dimension} · Mục tiêu {skill.requiredLevel}
                              /100
                            </small>
                          </div>
                          <button
                            type="button"
                            aria-pressed={excluded}
                            onClick={() =>
                              setExcludedIds((previous) =>
                                excluded
                                  ? previous.filter((id) => id !== skill.id)
                                  : [...previous, skill.id],
                              )
                            }
                          >
                            {excluded ? "Thêm lại" : "Không phù hợp"}
                          </button>
                        </article>
                      );
                    })}
                </div>
              ),
            )}
            <div className="sp-sandbox-toggle">
              <div>
                <FlaskConical size={20} />
                <span>
                  <strong>Khám phá nhanh công việc</strong>
                  <small>
                    Tình huống tùy chọn, không dùng để chấm năng lực.
                  </small>
                </span>
              </div>
              <button
                className="sp-secondary"
                type="button"
                onClick={() => {
                  setSandboxOpen((value) => !value);
                  setScenarioChoice(null);
                }}
              >
                {sandboxOpen ? "Đóng tình huống" : "Mở tình huống"}
              </button>
            </div>
            {sandboxOpen && (
              <div className="sp-sandbox-panel">
                <p>{scenario.scenario}</p>
                <div className="sp-choices">
                  {scenario.choices.map((choice, index) => (
                    <button
                      type="button"
                      key={choice.title}
                      aria-pressed={scenarioChoice === index}
                      onClick={() => setScenarioChoice(index)}
                    >
                      <span className="sp-choice-letter">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>
                        <strong>{choice.title}</strong>
                        <small>{choice.description}</small>
                      </span>
                      {scenarioChoice === index && <Check size={16} />}
                    </button>
                  ))}
                </div>
                {scenarioChoice !== null && (
                  <div className="sp-feedback">
                    <strong>Gợi ý tham khảo</strong>
                    <p>{scenario.choices[scenarioChoice].feedback}</p>
                  </div>
                )}
              </div>
            )}
            {includedIds.length === 0 && (
              <p className="sp-error" role="alert">
                Cần giữ lại ít nhất một kỹ năng mục tiêu.
              </p>
            )}
            <div className="sp-actions">
              <button className="sp-back" onClick={() => go(2)}>
                <ArrowLeft size={16} />
                Quay lại
              </button>
              <button
                className="sp-primary"
                disabled={includedIds.length === 0}
                onClick={() => (claimed.length ? go(4) : go(5))}
              >
                {claimed.length ? "Bắt đầu đánh giá" : "Tạo lộ trình từ đầu"}
                <ArrowRight size={17} />
              </button>
            </div>
          </section>
        )}

        {step === 4 && currentSkill && question && answer && (
          <section className="sp-assessment-layout">
            <aside className="sp-assessment-nav">
              <p className="sp-eyebrow">TIẾN TRÌNH THEO KỸ NĂNG</p>
              {claimed.map((skill, index) => (
                <button
                  key={skill.id}
                  className={index === assessmentIndex ? "active" : ""}
                  onClick={() => setAssessmentIndex(index)}
                >
                  <span>
                    {answers[skill.id]?.submitted ? (
                      <Check size={13} />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <div>
                    <strong>{skill.name}</strong>
                    <small>
                      {answers[skill.id]?.submitted
                        ? "Đã ghi nhận"
                        : `Tự đánh giá ${skill.level}/5`}
                    </small>
                  </div>
                </button>
              ))}
            </aside>
            <div className="sp-card sp-assessment-card">
              <div className="sp-assessment-meta">
                <span>{question.dimension}</span>
                <span>Độ khó: {question.difficulty}</span>
              </div>
              <h2>{currentSkill.name}</h2>
              <p className="sp-question">{question.prompt}</p>
              <div className="sp-rubric">
                <p className="sp-eyebrow">RUBRIC HIỂN THỊ TRƯỚC KHI TRẢ LỜI</p>
                <ul>
                  {question.rubric.map((item) => (
                    <li key={item}>
                      <Check size={14} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveAnswer();
                }}
              >
                <label htmlFor="answer">Câu trả lời của bạn</label>
                <textarea
                  id="answer"
                  rows={6}
                  value={answer.text}
                  disabled={answer.dontKnow}
                  onChange={(e) =>
                    setAnswers((previous) => ({
                      ...previous,
                      [currentSkill.id]: {
                        text: e.target.value,
                        submitted: false,
                        dontKnow: false,
                      },
                    }))
                  }
                  placeholder="Mô tả vấn đề, cách xử lý và cách bạn kiểm tra kết quả…"
                />
                {answer.submitted && (
                  <div className="sp-feedback" role="status">
                    <strong>
                      <Check size={16} />
                      Đã ghi nhận câu trả lời
                    </strong>
                    <p>
                      {answer.dontKnow
                        ? "Không biết là một câu trả lời hợp lệ. Hệ thống sẽ xem đây là điểm bắt đầu cần hỗ trợ."
                        : question.hint}
                    </p>
                    <small>
                      Bạn có thể bổ sung ví dụ cụ thể để câu trả lời rõ ràng hơn.
                    </small>
                  </div>
                )}
                <div className="sp-answer-actions">
                  {!answer.submitted && (
                    <button
                      type="button"
                      className="sp-text-button"
                      onClick={() => saveAnswer(true)}
                    >
                      Tôi chưa biết
                    </button>
                  )}
                  {!answer.submitted ? (
                    <button
                      className="sp-primary"
                      disabled={!answer.text.trim()}
                      type="submit"
                    >
                      Ghi nhận câu trả lời <ArrowRight size={17} />
                    </button>
                  ) : (
                    <button
                      className="sp-primary"
                      type="button"
                      onClick={() =>
                        assessmentIndex < claimed.length - 1
                          ? setAssessmentIndex(assessmentIndex + 1)
                          : go(5)
                      }
                    >
                      {assessmentIndex < claimed.length - 1
                        ? "Kỹ năng tiếp theo"
                        : "Tạo lộ trình"}
                      <ArrowRight size={17} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>
        )}

        {step === 5 && (
          <>
            <RoadmapView milestones={roadmap} profile={profile} />
            <div className="sp-final-actions">
              <button
                className="sp-secondary"
                onClick={() => go(claimed.length ? 4 : 3)}
              >
                <ArrowLeft size={16} />
                Xem lại đầu vào
              </button>
              <button className="sp-primary" onClick={reset}>
                Tạo hồ sơ mới <ArrowRight size={17} />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
