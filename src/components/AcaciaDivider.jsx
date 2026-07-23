/* Signature divider: a small acacia canopy on a hairline, echoing the logo mark */

function AcaciaDivider() {
    return (
        <div className="acacia-divider" aria-hidden="true">
            <span className="acacia-divider__line" />
            <svg className="acacia-divider__glyph" viewBox="0 0 40 20" fill="none">
                <path
                    d="M2 12c4-7 11-10 14-10s10 3 14 10c-5 4-10 1-14-2-4 3-9 6-14 2z"
                    fill="var(--color-green)"
                />
                <path d="M16 12v6" stroke="var(--color-green)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="acacia-divider__line" />
        </div>
    );
}

export default AcaciaDivider;
