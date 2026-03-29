.wrap {
  max-width: 560px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.progressBar {
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin-bottom: 2rem;
}

.progressFill {
  height: 100%;
  background: #1D9E75;
  border-radius: 2px;
  transition: width 0.4s ease;
}

.step {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.qLabel {
  font-size: 12px;
  font-weight: 500;
  color: #1D9E75;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.qTitle {
  font-size: 22px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
  line-height: 1.35;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.opt {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, background 0.15s;
  width: 100%;
}

.opt:hover {
  border-color: #1D9E75;
  background: #f0fdf8;
}

.opt.selected {
  border-color: #1D9E75;
  background: #E1F5EE;
}

.optIcon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  flex-shrink: 0;
}

.opt.selected .optIcon {
  background: #9FE1CB;
}

.optLabel {
  font-size: 15px;
  font-weight: 500;
  color: #111827;
}

.optSub {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
}

.btn {
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1.5px solid #d1d5db;
  background: #fff;
  color: #374151;
  transition: background 0.15s;
}

.btn:hover {
  background: #f9fafb;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btnPrimary {
  background: #1D9E75;
  color: #fff;
  border-color: #1D9E75;
}

.btnPrimary:hover:not(:disabled) {
  background: #0F6E56;
}

/* Result card */
.resultCard {
  border: 1.5px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  animation: fadeIn 0.3s ease;
}

.resultHeader {
  background: #1D9E75;
  padding: 1.5rem;
}

.resultHeader h2 {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.resultHeader p {
  font-size: 13px;
  color: #9FE1CB;
}

.resultBody {
  padding: 1.5rem;
}

.suppList {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 1.5rem;
}

.suppItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  background: #f9fafb;
  border-radius: 10px;
  text-decoration: none;
  border: 1px solid #f0fdf8;
  transition: background 0.15s, border-color 0.15s;
}

.suppItem:hover {
  background: #E1F5EE;
  border-color: #9FE1CB;
}

.suppBadge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
  background: #E1F5EE;
  color: #085041;
  margin-bottom: 4px;
}

.suppName {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.suppDesc {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.suppArrow {
  font-size: 18px;
  color: #1D9E75;
  flex-shrink: 0;
  margin-left: 12px;
}

/* Email form */
.emailForm {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.25rem;
}

.emailForm > p {
  font-size: 14px;
  color: #374151;
  margin-bottom: 0.75rem;
}

.emailRow {
  display: flex;
  gap: 8px;
}

.emailInput {
  flex: 1;
  padding: 10px 12px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background: #fff;
  outline: none;
  transition: border-color 0.15s;
}

.emailInput:focus {
  border-color: #1D9E75;
}

.errorMsg {
  font-size: 12px;
  color: #dc2626;
  margin-top: 6px;
}

.disclaimer {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 8px;
}

/* Success */
.successMsg {
  text-align: center;
  padding: 1.5rem 1rem;
  border-top: 1px solid #e5e7eb;
}

.successIcon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #E1F5EE;
  color: #1D9E75;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
}

.successMsg p {
  font-size: 14px;
  color: #374151;
}
    </div>
  );
}
