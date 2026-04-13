"use client";

import { useState, useEffect } from "react";

type CookiePreferences = {
	essential: boolean;
	analytics: boolean;
	marketing: boolean;
	functional: boolean;
};

const COOKIE_CONSENT_KEY = "cookie-consent";

const defaultPreferences: CookiePreferences = {
	essential: true,
	analytics: false,
	marketing: false,
	functional: false,
};

export function CookieConsentBanner() {
	const [isVisible, setIsVisible] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

	useEffect(() => {
		const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
		if (!consent) {
			setIsVisible(true);
		}
	}, []);

	const saveConsent = (prefs: CookiePreferences) => {
		localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
		setIsVisible(false);
	};

	const handleAcceptAll = () => {
		const allAccepted: CookiePreferences = {
			essential: true,
			analytics: true,
			marketing: true,
			functional: true,
		};
		setPreferences(allAccepted);
		saveConsent(allAccepted);
	};

	const handleRejectAll = () => {
		const onlyEssential: CookiePreferences = {
			essential: true,
			analytics: false,
			marketing: false,
			functional: false,
		};
		setPreferences(onlyEssential);
		saveConsent(onlyEssential);
	};

	const handleSavePreferences = () => {
		saveConsent(preferences);
	};

	const handleToggle = (key: keyof CookiePreferences) => {
		if (key === "essential") return;
		setPreferences((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	if (!isVisible) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 p-4 backdrop-blur-sm sm:items-center">
			<div className="w-full max-w-lg rounded-lg border border-neutral-200 bg-white p-6 shadow-xl">
				<h2 className="mb-2 text-lg font-semibold text-neutral-900">
					Налаштування cookies
				</h2>
				<p className="mb-4 text-sm text-neutral-600">
					Ми використовуємо cookies для покращення вашого досвіду на сайті. Ви можете
					налаштувати свої переваги нижче.
				</p>

				{showSettings ? (
					<div className="mb-4 space-y-3">
						<CookieCategory
							title="Необхідні"
							description="Потрібні для роботи сайту. Не можна вимкнути."
							checked={preferences.essential}
							disabled
							onChange={() => {}}
						/>
						<CookieCategory
							title="Аналітика"
							description="Допомагають нам зрозуміти, як ви використовуєте сайт."
							checked={preferences.analytics}
							onChange={() => handleToggle("analytics")}
						/>
						<CookieCategory
							title="Маркетинг"
							description="Використовуються для показу релевантної реклами."
							checked={preferences.marketing}
							onChange={() => handleToggle("marketing")}
						/>
						<CookieCategory
							title="Функціональні"
							description="Запам'ятовують ваші налаштування та переваги."
							checked={preferences.functional}
							onChange={() => handleToggle("functional")}
						/>

						<div className="flex flex-col gap-2 pt-2 sm:flex-row">
							<button
								onClick={handleSavePreferences}
								className="flex-1 rounded bg-neutral-800 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-700"
							>
								Зберегти налаштування
							</button>
							<button
								onClick={() => setShowSettings(false)}
								className="flex-1 rounded border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
							>
								Назад
							</button>
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-2 sm:flex-row">
						<button
							onClick={handleAcceptAll}
							className="flex-1 rounded bg-neutral-800 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-700"
						>
							Прийняти всі
						</button>
						<button
							onClick={handleRejectAll}
							className="flex-1 rounded border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
						>
							Тільки необхідні
						</button>
						<button
							onClick={() => setShowSettings(true)}
							className="flex-1 rounded border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
						>
							Налаштувати
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

function CookieCategory({
	title,
	description,
	checked,
	disabled = false,
	onChange,
}: {
	title: string;
	description: string;
	checked: boolean;
	disabled?: boolean;
	onChange: () => void;
}) {
	return (
		<div className="flex items-start justify-between gap-4 rounded border border-neutral-200 bg-neutral-50 p-3">
			<div className="flex-1">
				<p className="text-sm font-medium text-neutral-900">{title}</p>
				<p className="text-xs text-neutral-500">{description}</p>
			</div>
			<label className="relative inline-flex cursor-pointer items-center">
				<input
					type="checkbox"
					checked={checked}
					disabled={disabled}
					onChange={onChange}
					className="peer sr-only"
				/>
				<div
					className={`h-6 w-11 rounded-full border transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5 ${
						disabled
							? "cursor-not-allowed border-neutral-300 bg-neutral-400"
							: "border-neutral-300 bg-neutral-300 peer-checked:border-neutral-800 peer-checked:bg-neutral-800"
					}`}
				/>
			</label>
		</div>
	);
}
