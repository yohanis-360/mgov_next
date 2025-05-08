"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from '@/contexts/LanguageContext';

export default function TermsAndConditions() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const userType = searchParams.get("type") || "user";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('terms_title')}</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4">{t('terms_intro')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Definitions</h2>
        <p className="mb-4">{t('terms_definitions')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Account Registration</h2>
        <p className="mb-4">{t('terms_account')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">User Responsibilities</h2>
        <p className="mb-4">{t('terms_user_responsibilities')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Developer Responsibilities</h2>
        <p className="mb-4">{t('terms_developer_responsibilities')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Privacy</h2>
        <p className="mb-4">{t('terms_privacy')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Intellectual Property</h2>
        <p className="mb-4">{t('terms_ip')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Termination</h2>
        <p className="mb-4">{t('terms_termination')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Terms</h2>
        <p className="mb-4">{t('terms_changes')}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p className="mb-4">{t('terms_contact')}</p>
        
        <div className="mt-8">
          <a href="/register" className="text-blue-600 hover:text-blue-800">
            {t('terms_back')}
          </a>
        </div>
      </div>
    </div>
  );
} 