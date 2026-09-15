import {
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Route,
  Sparkles,
} from "lucide-react";
import type { Milestone, ProfileInput } from "./demo-data";

export function RoadmapView({
  milestones,
  profile,
}: {
  milestones: Milestone[];
  profile: ProfileInput;
}) {
  const totalHours = milestones.reduce(
    (sum, item) => sum + item.estimatedHours,
    0,
  );
  const weeks = Math.max(1, Math.ceil(totalHours / profile.weeklyHours));
  return (
    <section aria-label="Lộ trình học tập">
      <div className="sp-roadmap-hero">
        <div>
          <span className="sp-system-badge">
            <Sparkles size={14} /> Lộ trình cá nhân hóa
          </span>
          <h2>Lộ trình cho {profile.career}</h2>
          <p>
            Các mốc ưu tiên những kỹ năng bạn cần cải thiện và phù hợp với quỹ
            thời gian học mỗi tuần.
          </p>
        </div>
        <div className="sp-roadmap-stats">
          <div>
            <strong data-testid="milestone-count">{milestones.length}</strong>
            <span>mốc đề xuất</span>
          </div>
          <div>
            <strong>{totalHours}h</strong>
            <span>khối lượng dự kiến</span>
          </div>
          <div>
            <strong>~{weeks}</strong>
            <span>tuần theo lịch học</span>
          </div>
        </div>
      </div>
      <div className="sp-readonly-note">
        <LockKeyhole size={16} />
        <span>
          Muốn điều chỉnh lộ trình, hãy xem lại mục tiêu hoặc cập nhật hồ sơ kỹ
          năng của bạn.
        </span>
      </div>
      <ol className="sp-roadmap-list">
        {milestones.map((milestone, index) => (
          <li key={milestone.id} className="sp-roadmap-item">
            <div className="sp-roadmap-node">
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <article>
              <div className="sp-roadmap-item-head">
                <div>
                  <p className="sp-eyebrow">MỐC {index + 1}</p>
                  <h3>{milestone.title.replace(/^\d+\.\s*/, "")}</h3>
                </div>
                <span className="sp-hour-chip">
                  <Clock3 size={14} /> {milestone.estimatedHours} giờ
                </span>
              </div>
              <p className="sp-roadmap-description">{milestone.description}</p>
              <div className="sp-roadmap-detail-grid">
                <div>
                  <span>
                    <CheckCircle2 size={15} /> Minh chứng hoàn thành
                  </span>
                  <p>{milestone.outcome}</p>
                </div>
                <div>
                  <span>
                    <Route size={15} /> Vì sao có mốc này
                  </span>
                  <p>{milestone.reason}</p>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
