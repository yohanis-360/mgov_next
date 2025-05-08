"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'am';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

type LanguageState = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getBackendValue: (key: string) => string; // Always returns English value
};

const translations: Translations = {
  en: {
    // Common
    'login': 'Login',
    'logout': 'Logout',
    'submit': 'Submit',
    'cancel': 'Cancel',
    'download': 'Download',
    'reviews': 'Reviews',
    'write_review': 'Write a Review',
    'related_apps': 'Related Apps',
    'screenshots': 'Screenshots',
    'about_app': 'About this app',
    'downloads': 'Downloads',
    'category': 'Category',
    'install_ios': 'Install iOS',
    'download_apk': 'Download APK',
    'review_submitted': 'Review Submitted Successfully!',
    'thank_you_review': 'Thank you for your feedback! Your review has been submitted and will be visible to other users.',
    'login_required': 'Login Required',
    'login_to_review': 'You need to be logged in to write a review. Would you like to login now?',
    'share_feedback': 'Share your feedback to help others! Submit your review, and we\'ll ensure it meets our guidelines before publishing.',
    'leave_comment': 'Leave A Comment',
    'rating': 'Rating',
    'latest_updates': 'Latest Updates',
    'top_apps': 'Top Apps',
    'additional_apps': 'Additional Apps',
    'view_details': 'View Details',
    'search_placeholder': 'Search apps...',
    'search_button': 'Search',
    'version': 'Version',
    'register_date': 'Register Date',
    'status': 'Status',
    'action': 'Action',
    'total_apps': 'Total Apps',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'pending': 'Pending',
    'or': 'or',
    'back': 'Back',
    'passwords_dont_match': 'Passwords do not match',
    'send': 'Send',
    
    // Forgot Password Page
    'forgot_password_title': 'Forgot Password',
    'reset_password': 'Reset Password',
    'reset_instructions': 'Enter your email address and we\'ll send you instructions to reset your password',
    'email_address': 'Email Address',
    'enter_email': 'Enter your email address',
    'send_reset_instructions': 'Send Reset Instructions',
    'back_to_login': 'Back to Login',
    'reset_email_sent': 'Password reset instructions have been sent to your email.',
    'reset_error': 'Something went wrong. Please try again.',
    'reset_error_occurred': 'An error occurred. Please try again later.',
    
    // Email Verification Page
    'check_your_email': 'Check your Email',
    'email_instructions': 'We have sent an email with password reset instructions to your email address.',
    'verification_code': 'Verification Code',
    'enter_verification_code': 'Enter verification code',
    'didnt_receive_email': 'Didn\'t receive the email?',
    'resend': 'Resend',
    'verify_otp': 'Verify OTP',
    'resend_otp': 'Resend OTP',
    
    // Reset Password Page
    'reset_password_title': 'Reset Password',
    'choose_new_password': 'Choose a new password for your account',
    'your_new_password': 'Your New Password',
    'enter_new_password': 'Enter new password',
    'confirm_new_password': 'Confirm Your New Password',
    'confirm_new_password_placeholder': 'Confirm your new password',
    'password_reset': 'Password Reset',
    'password_length_error': 'Your password must be at least 8 characters long',
    
    // Contact Us Page
    'contact_us': 'Contact Us',
    'contact_subtitle': 'Have a question or need assistance? Connect with us, and we\'ll ensure you get the support you\'re looking for.',
    'get_in_touch': 'Get in Touch',
    'send_message': 'Send us your message, and we\'ll be in touch soon.',
    'full_name': 'First Name',
    'email': 'Email',
    'phone_no': 'Phone No',
    'your_message': 'Your Message',
    'contact_details': 'Contact Details',
    'contact_help': 'We\'re here to help. Feel free to reach out to us via phone, fax, or email.',
    'phone': 'Phone',
    'fax': 'Fax',
    'copyright': 'Copyright © {year} App Store. All rights reserved.',
    'facebook': 'Facebook',
    'twitter': 'Twitter',
    'linkedin': 'LinkedIn',
    'developers': 'Developers',
    'developer_console': 'Developer Console',
    'submit_apk': 'Submit APK',
    'company': 'Company',
    'about_us': 'About Us',
    'faq': 'FAQ',
    'copyright_bottom': 'Copyright © {year} Gov App Ethiopia All rights reserved. | Privacy Policy | Copyright Policy | Terms |',
    
    // FAQ Page
    'faq_title': 'Frequently Asked Questions',
    'faq_subtitle': 'For Ethiopian Gov App Store',
    'faq_description': 'Access trusted government apps and services in one secure platform. Simplifying your connection to essential resources, anytime, anywhere. Empowering citizens with reliable digital solutions.',
    'platform': 'Platform',
    'citizen': 'Citizen',
    'developer': 'Developer',
    'faq_question1': 'What is the Ethiopian Gov App Store?',
    'faq_answer1': 'The Ethiopian Gov App Store is an official platform where you can find trusted government apps and services to simplify access to essential resources.',
    'faq_question2': 'How do I download apps from the store?',
    'faq_answer2': 'You can download apps by visiting the app page and clicking on the download button.',
    'faq_question3': 'Are the apps on the store safe and verified?',
    'faq_answer3': 'Yes, all apps go through a verification process to ensure safety and reliability.',
    'faq_question4': 'Do I need to create an account to use the store?',
    'faq_answer4': 'No, you can access most apps without an account. However, creating an account offers additional benefits.',
    'faq_question5': 'Is the Ethiopian Gov App Store free to use?',
    'faq_answer5': 'Yes, the platform is free to use for all citizens.',
    'faq_question6': 'What devices are supported by the app store?',
    'faq_answer6': 'The store supports Android and iOS devices.',
    
    // Landing Page
    'welcome_banner': 'Welcome to the Ethiopian Government App Store This is our best app developed by 360ground',
    'explore_apps': 'Explore Our Top-Rated Applications',
    'simplifying_governance': 'Simplifying Governance with Technology',
    'empowering_citizens': 'Empowering Citizens Through Apps',
    'education': 'Education',
    'finance': 'Finance',
    'health': 'Health',
    'agriculture': 'Agriculture',
    'trade': 'Trade',
    'government_appstore': 'Government Appstore',
    'official_appstore_fdre': 'The official app store of FDRE',
    'mobile_apps': 'Mobile Apps',
    'web_portal': 'Web Portal',
    'search_apps': 'Search apps',
    'android_icon': 'Android Icon',
    'android': 'Android',
    'ios_icon': 'iOS Icon',
    'ios': 'iOS',
    'latest_app': 'Latest App',
    'no_apps_found': 'No apps found',
    'copyright_policy': 'Copyright Policy',
    'terms': 'Terms',
    
    // Terms and Conditions
    'terms_title': 'Terms and Conditions',
    'terms_intro': 'Welcome to the mGov App Store platform. These Terms and Conditions govern your use of our platform and the services we provide. By accessing or using our platform, you agree to be bound by these Terms.',
    'terms_definitions': '"Platform" refers to the mGov App Store, including all its features and services. "User" refers to individuals who register to use the platform to download and use applications. "Developer" refers to individuals or organizations who register to develop and submit applications to the platform.',
    'terms_account': 'To use our platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.',
    'terms_user_responsibilities': 'Users are responsible for maintaining the confidentiality of their account information and password. Users are responsible for all activities that occur under their account. Users must notify us immediately of any unauthorized use of their account.',
    'terms_developer_responsibilities': 'Developers are responsible for the content, quality, and performance of their applications. Developers must ensure their applications comply with our guidelines and applicable laws. Developers must provide accurate information about their applications and update it as necessary.',
    'terms_privacy': 'Our Privacy Policy describes how we collect, use, and share information when you use our platform. By using our platform, you consent to our collection and use of information as described in our Privacy Policy.',
    'terms_ip': 'All content, features, and functionality of our platform are owned by us or our licensors and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.',
    'terms_termination': 'We reserve the right to terminate or suspend your account and access to our platform at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.',
    'terms_changes': 'We may revise these Terms at any time by updating this page. By continuing to use our platform after such changes, you agree to be bound by the revised Terms.',
    'terms_contact': 'If you have any questions about these Terms, please contact us at support@mgovappstore.com.',
    'terms_back': 'Back to Registration',
    
    // About Us
    'about_title': 'About Us',
    'about_subtitle': 'Empowering Digital Transformation Through Trusted Applications',
    'about_objectives': 'Main Objectives',
    'about_objectives_subtitle': 'Empowering Developers and Enhancing User Experience Through a Unified App Marketplace',
    'about_digital': 'Promote Digital Transformation',
    'about_digital_desc': 'Support the adoption of innovative technologies to streamline processes, improve efficiency, and foster transparency across government services.',
    'about_security': 'Ensure Security and Reliability',
    'about_security_desc': 'Deliver trusted and verified applications that safeguard user data and maintain high standards of security.',
    'about_collaboration': 'Foster Collaboration and Innovation',
    'about_collaboration_desc': 'Partner with government and non-government organizations to develop forward-thinking solutions that meet the evolving needs of users.',
    // Additional About Us translations
    'about_mission_title': 'Our Mission',
    'about_mission_desc': 'To provide a secure, user-friendly platform that connects citizens with trusted government applications, fostering digital inclusion and enhancing public service accessibility.',
    'about_vision_title': 'Our Vision',
    'about_vision_desc': 'To be the leading digital marketplace for government services, empowering citizens through technology and creating a more connected, efficient, and transparent public sector.',
    'years': 'Years of Service',
    'apps': 'Apps Available',
    'download_rate': 'Download Rate (K)',
    'industries_served': 'Industries Served',
    'about_services_title': 'Seamless Access to Trusted Government Services',
    'about_services_desc': 'The Government App Store revolutionizes how you interact with public services by offering a centralized platform for secure and user-friendly applications. Whether you\'re accessing essential documents, managing permits, or exploring community resources, our curated collection of apps ensures convenience and reliability. Join the movement towards digital governance and experience the future of streamlined public services today.',

    // User/Developer Login/Register
    'sign_up': 'Sign up',
    'sign_in': 'Sign in',
    'sign_up_with_google': 'Sign up with Google',
    'sign_in_with_google': 'Sign in with Google',
    'already_have_account': 'Already have an account?',
    'need_account': 'Need an account?',
    'create_one': 'Create one',
    'first_name': 'First Name',
    'last_name': 'Last Name',
    'username': 'Username',
    'password': 'Password',
    'confirm_password': 'Confirm Password',
    'mobile_number': 'Phone Number',
    'date_of_birth': 'Date of Birth',
    'gender': 'Gender',
    'male': 'Male',
    'female': 'Female',
    'organization_name': 'Organization Name',
    'organization_address': 'Organization Address',
    'organization_website': 'Organization Website',
    'city': 'City',
    'woreda': 'Woreda',
    'zone': 'Zone',
    'sub_city': 'Sub City',
    'business_registration_number': 'Business Registration Number',
    'citizen_login': 'Citizen Login',
    'developer_login': 'Developer Login',
    'citizen_registration': 'Citizen Account Registration',
    'developer_registration': 'Developer Account Registration',
    'welcome_message': 'WELCOME TO GOVERNMENT APP STORE',
    'gateway_message': 'your gateway to official services and solutions!',
    'please_login': 'Please login to continue to your account.',
    'enter_username': 'Enter your username',
    'remember_me': 'Remember me',
    'forgot_password': 'Forgot Password?',
    'continue': 'Continue',
    'registration_successful': 'Registration Successful!',
    'account_created': 'Your account has been successfully created. You can now log in to access the mGov App Store.',
    'go_to_login': 'Go to Login',
    'close': 'Close',
    'create_account_message': 'To complete the registration process, please accept the terms and conditions and create an account.',
    'registration_instructions': 'Please accept the terms and conditions and create an account.',
    'password_requirements': 'Your password must be at least 8 characters long.',
    'terms_agreement': 'I accept the terms and conditions and agree to create an account.',
    'already_registered': 'Already registered?',
    'login_here': 'Login here',
    'enter_phone_number': 'Enter a valid Ethiopian phone number (e.g., +251941234567 or 0941234567)',
    'phone_validation': 'Please enter a valid Ethiopian phone number (+251XXXXXXXXX or 09XXXXXXXX)',
    'password_validation': 'Password must be at least 8 characters long and include letters and numbers',
    'terms_required': 'You must accept the Terms and Conditions',
    'captcha_required': 'Please complete the CAPTCHA verification',
    'registration_failed': 'Registration failed. Please try again.',
    'error_occurred': 'An error occurred. Please try again.',
    'organization_info': 'Organization Info',
    'provide_org_details': 'Provide your organization\'s details to complete registration',
    'enter_field': 'Enter {field}',
    'field_required': '{field} is required',
    
    // Developer Portal
    'developer_pending_message': 'Your registration request for the app store is currently under review. We\'ll notify you once the review process is complete. Thank you for your patience!',
    'developer_rejected_message': 'Your registration request has been rejected. Please correct your information and try again.',
    'developer_approved_message': 'You are approved and ready to submit your app!',
    'developer_login_message': 'Please log in to view your app submission status.',
    'developer_registration_review': 'Registration Under Review',
    'developer_registration_rejection': 'Registration Rejection',
    
    // Developer Portal Appstore
    'overview': 'Overview',
    'account_details': 'Account Details',
    'settings': 'Settings',
    'submit_new_app': 'Submit New App',
    'phone_number': 'Phone Number',
    // Settings Section
    'account_settings': 'Account Settings',
    'change_password': 'Change Password',
    'current_password': 'Current Password',
    'new_password': 'New Password',
    'enter_current_password': 'Enter your current password',
    'current_password_required': 'Current password is required',
    'new_password_required': 'New password is required',
    'password_min_length': 'Password must be at least 8 characters long',
    'confirm_password_required': 'Please confirm your new password',
    'password_changed_success': 'Password changed successfully',
    'password_change_failed': 'Failed to change password. Please try again.',
    'password_change_error': 'An error occurred. Please try again.',
    'processing': 'Processing...',
    'password_requirement_hint': 'Password must be at least 8 characters long',
    'min_eight_chars': 'Minimum 8 characters long',
    'include_uppercase': 'Include at least one uppercase letter',
    'include_number': 'Include at least one number',
    'include_special_char': 'Include at least one special character',
    'password_changed_title': 'Password Changed Successfully',
    'login_again': 'Login Again',
    'password_changed_message': 'Your password has been updated. Please login again with your new password.',
    
    // Account Information Section
    'personal_information': 'Personal Information',
    'address_information': 'Address Information',
    'account_organization_details': 'Account And Organization Details',
    'organization_information': 'Organization Information',
    'app_name':'App Name',
    // App Submission Form
    'app_version': 'App Version',
    'supported_platforms': 'Supported Platforms',
    'previous': 'Previous',
    'next': 'Next',
    'app_icon': 'App Icon',
    'apk_file': 'APK File',
    'cover_graphics': 'Cover Graphics',
    'add_screenshot': 'Add Screenshot',
    'description': 'Description',
    'privacy_policy_url': 'Privacy Policy URL',
    'web_portal_url_optional': 'Web Portal URL (Optional)',
  },
  am: {
    // Common
    'login': 'ግባ',
    'logout': 'ውጣ',
    'submit': 'ላክ',
    'cancel': 'ሰርዝ',
    'download': 'አውርድ',
    'reviews': 'ግምገማዎች',
    'write_review': 'ግምገማ ጻፍ',
    'related_apps': 'ተዛማጅ መተግበሪያዎች',
    'screenshots': 'ስክሪንሾት',
    'about_app': 'ስለ መተግበሪያው',
    'downloads': 'የሚወርዱ',
    'category': 'ምድብ',
    'app_name':'የመተግበሪያው ስም',
    'install_ios': 'iOS ጫን',
    'download_apk': 'APK አውርድ',
    'review_submitted': 'ግምገማዎ በተሳካ ሁኔታ ቀርቧል!',
    'thank_you_review': 'ለግምገማዎ እናመሰግናለን! ግምገማዎ ተላልፏል እና ለሌሎች ተጠቃሚዎች ይታያል።',
    'login_required': 'መግባት ያስፈልጋል',
    'login_to_review': 'ግምገማ ለመጻፍ መግባት ያስፈልግዎታል። አሁን መግባት ይፈልጋሉ?',
    'share_feedback': 'ለሌሎች ለመርዳት አስተያየትዎን ያጋሩ! ግምገማዎን ያስገቡ፣ እና ከማተም በፊት ከመመሪያችን ጋር እንደሚስማማ እናረጋግጣለን።',
    'leave_comment': 'አስተያየት ይስጡ',
    'rating': 'ደረጃ',
    'latest_updates': 'የቅርብ ዝመናዎች',
    'top_apps': 'የተለመዱ መተግበሪያዎች',
    'additional_apps': 'ተጨማሪ መተግበሪያዎች',
    'view_details': 'ዝርዝሮችን ይመልከቱ',
    'search_placeholder': 'መተግበሪያዎችን ይፈልጉ...',
    'search_button': 'ፈልግ',
    'phone_number': 'ስልክ ቁጥር',
    'version': 'ስሪት',
    'register_date': 'የተመዘገበበት ቀን',  
    'status': 'ሁኔታ',
    'action': 'እርምጃ',
    'total_apps': 'ጠቅላላ መተግበሪያዎች',
    'approved': 'ጸድቋል',
    'rejected': 'ተቀባይነት አላገኘም',
    'pending': 'በመጠበቅ ላይ',
    'or': 'ወይም',
    'back': 'ተመለስ',
    'passwords_dont_match': 'የይለፍ ቃሎች አይመሳሰሉም',
    'send': 'ላክ',
    
    // Forgot Password Page
    'forgot_password_title': 'የይለፍ ቃል ረሳሁ',
    'reset_password': 'የይለፍ ቃል ዳግም ያስጀምሩ',
    'reset_instructions': 'የኢሜይል አድራሻዎን ያስገቡ እና የይለፍ ቃልዎን ዳግም ለማስጀመር መመሪያዎችን እንልክልዎታለን',
    'email_address': 'የኢሜይል አድራሻ',
    'enter_email': 'የኢሜይል አድራሻዎን ያስገቡ',
    'send_reset_instructions': 'የዳግም ማስጀመሪያ መመሪያዎችን ይላኩ',
    'back_to_login': 'ወደ መግቢያ ተመለስ',
    'reset_email_sent': 'የይለፍ ቃል ዳግም ማስጀመሪያ መመሪያዎች ወደ ኢሜይልዎ ተልከዋል።',
    'reset_error': 'ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።',
    'reset_error_occurred': 'ስህተት ተከስቷል። እባክዎ ቆይተው እንደገና ይሞክሩ።',
    
    // Email Verification Page
    'check_your_email': 'ኢሜይልዎን ይፈትሹ',
    'email_instructions': 'የይለፍ ቃል ዳግም ማስጀመሪያ መመሪያዎችን ወደ ኢሜይል አድራሻዎ ልከናል።',
    'verification_code': 'የማረጋገጫ ኮድ',
    'enter_verification_code': 'የማረጋገጫ ኮድ ያስገቡ',
    'didnt_receive_email': 'ኢሜይሉን አልተቀበሉም?',
    'resend': 'እንደገና ላክ',
    'resend_otp':'እንደገና ኦትፒ ላክ',
    
    // Reset Password Page
    'reset_password_title': 'የይለፍ ቃል ዳግም ያስጀምሩ',
    'choose_new_password': 'ለመለያዎ አዲስ የይለፍ ቃል ይምረጡ',
    'your_new_password': 'አዲስ የይለፍ ቃልዎ',
    'enter_new_password': 'አዲስ የይለፍ ቃል ያስገቡ',
    'confirm_new_password': 'አዲስ የይለፍ ቃልዎን ያረጋግጡ',
    'confirm_new_password_placeholder': 'አዲስ የይለፍ ቃልዎን ያረጋግጡ',
    'password_reset': 'የይለፍ ቃል ዳግም ማስጀመሪያ',
    'password_length_error': 'የይለፍ ቃልዎ ቢያንስ 8 ቁምፊዎች መሆን አለበት',
    
    // Contact Us Page
    'contact_us': 'አግኙን',
    'contact_subtitle': 'ጥያቄ አለዎት ወይም እርዳታ ያስፈልግዎታል? ከእኛ ጋር ይገናኙ፣ እና የሚፈልጉትን ድጋፍ እንዳገኙ እናረጋግጣለን።',
    'get_in_touch': 'አግኙን',
    'send_message': 'መልእክትዎን ይላኩልን፣ እና በቅርቡ እንገናኝዎታለን።',
    'full_name': 'ስም',
    'email': 'ኢሜይል',
    'phone_no': 'ስልክ ቁጥር',
    'your_message': 'መልእክትዎ',
    'contact_details': 'የአድራሻ ዝርዝሮች',
    'contact_help': 'ለማገዝ እዚህ አለን። በስልክ፣ ፋክስ ወይም ኢሜይል',
    'phone': 'ስልክ',
    'fax': 'ፋክስ',
    'copyright': 'የቅጂ መብት © {year} መተግበሪያ መደብር። ሁሉም መብቶች የተጠበቁ ናቸው።',
    'facebook': 'ፌስቡክ',
    'twitter': 'ትዊተር',
    'linkedin': 'ሊንክዲን',
    'developers': 'ልማት ባለሙያዎች',
    'developer_console': 'ዲቨሎተር ኮንሶል',
    'submit_apk': 'APK አስገባ',
    'company': 'ኩባንያ',
    'about_us': 'ስለ እኛ',
    'faq': 'በተደጋጋሚ የሚጠየቁ ጥያቄዎች',
    'copyright_bottom': 'የቅጂ መብት © {year} የመንግስት መተግበሪያ ኢትዮጵያ ሁሉም መብቶች የተጠበቁ ናቸው። | የግላዊነት ፖሊሲ | የቅጂ መብት ፖሊሲ | የአገልግሎት ደረጃዎች |',
    
    // FAQ Page
    'faq_title': 'በተደጋጋሚ የሚጠየቁ ጥያቄዎች',
    'faq_subtitle': 'ለኢትዮጵያ የመንግስት መተግበሪያ መደብር',
    'faq_description': 'በአንድ ደህንነቱ የተጠበቀ መድረክ ላይ የታመኑ የመንግስት መተግበሪያዎችን እና አገልግሎቶችን ይድረሱ። በማንኛውም ጊዜ እና በማንኛውም ቦታ ወሳኝ ሀብቶችን ወደ መድረስ ለማቃለል። ተጠቃሚዎችን በታመኑ ዲጂታል መፍትሄዎች ማስተዳደር።',
    'platform': 'መድረክ',
    'citizen': 'ዜጋ',
    'developer': 'ልማት ባለሙያ',
    'faq_question1': 'የኢትዮጵያ የመንግስት መተግበሪያ መደብር ወሳኝ ሀብቶችን በቀላሉ ለመድረስ የታመኑ የመንግስት መተግበሪያዎችን እና አገልግሎቶችን ማግኘት የሚችሉበት ኦፊሴላዊ መድረክ ነው።',
    'faq_question2': 'ከመደብሩ መተግበሪያዎችን እንዴት ማውረድ እችላለሁ?',
    'faq_answer2': 'የመተግበሪያውን ገጽ በመጎብኘት እና በማውረድ ቁልፍ ላይ በመጫን መተግበሪያዎችን ማውረድ ይችላሉ።',
    'faq_question3': 'በመደብሩ ላይ ያሉት መተግበሪያዎች ደህንነታቸው የተጠበቀ እና የተረጋገጠ ናቸው?',
    'faq_answer3': 'አዎ፣ ሁሉም መተግበሪያዎች ደህንነታቸው እና አስተማማኝነታቸው እንዲረጋገጥ የማረጋገጫ ሂደት ውስጥ ይገባሉ።',
    'faq_question4': 'መደብሩ ለመጠቀም መለያ መፍጠር ያስፈልገኛል?',
    'faq_answer4': 'አይ፣ አብዛኛዎቹን መተግበሪያዎች ያለ መለያ መድረስ ይችላሉ። ሆኖም መለያ መፍጠር ተጨማሪ ጥቅሞችን ይሰጣል።',
    'faq_question5': 'የኢትዮጵያ የመንግስት መተግበሪያ መደብር ነጻ ነው?',
    'faq_answer5': 'አዎ፣ መድረኩ ለሁሉም ዜጎች ነጻ ነው።',
    'faq_question6': 'መደብሩ ምን አይነት መሳሪያዎችን ይደግፋል?',
    'faq_answer6': 'መደብሩ Android እና iOS መሳሪያዎችን ይደግፋል።',
    
    // Landing Page
    'welcome_banner': 'ወደ የኢትዮጵያ መንግስት መተግበሪያ መደብር እንኳን ደህና መጡ። ይህ በ360ground የተዘጋጀ ምርጥ መተግበሪያችን ነው።',
    'explore_apps': 'የተለመዱ መተግበሪያዎቻችንን ያስሱ',
    'simplifying_governance': 'በቴክኖሎጂ አስተዳደርን ማቃለል',
    'empowering_citizens': 'በመተግበሪያዎች ዜጎችን ማስተዳደር',
    'education': 'ትምህርት',
    'finance': 'ፋይናንስ',
    'health': 'ጤና',
    'agriculture': 'የግብርና',
    'trade': 'ንግድ',
    'government_appstore': 'የመንግስት መተግበሪያ መደብር',
    'official_appstore_fdre': 'የኢፌዲሪ ኦፊሴላዊ መተግበሪያ መደብር',
    'mobile_apps': 'ሞባይል መተግበሪያዎች',
    'web_portal': 'ዌብ ፖርታል',
    'search_apps': 'መተግበሪያዎችን ፈልግ',
    'android_icon': 'አንድሮይድ አይኮን',
    'android': 'አንድሮይድ',
    'ios_icon': 'አይኦኤስ አይኮን',
    'ios': 'አይኦኤስ',
    'latest_app': 'የቅርብ ጊዜ መተግበሪያ',
    'no_apps_found': 'ምንም መተግበሪያ አልተገኘም',
    'copyright_policy': 'የቅጂ መብት ፖሊሲ',
    'terms': 'የአገልግሎት ደረጃዎች',
    
    // Terms and Conditions
    'terms_title': 'የአገልግሎት ደረጃዎች እና ሁኔታዎች',
    'terms_intro': 'ወደ mGov መተግበሪያ መደብር መድረክ እንኳን ደህና መጡ። እነዚህ የአገልግሎት ደረጃዎች እና ሁኔታዎች የእኛን መድረክ እና አገልግሎቶቻችንን አጠቃቀምዎን ያስተዳድራሉ። መድረካችንን በመድረስ ወይም በመጠቀም እነዚህን ደረጃዎች እንደሚፈቅዱ ይስማማሉ።',
    'terms_definitions': '"መድረክ" ማለት mGov መተግበሪያ መደብር፣ ሁሉንም ባህሪያቱ እና አገልግሎቶቹ ያጠቃልላል። "ተጠቃሚ" ማለት መተግበሪያዎችን ለመውረድ እና ለመጠቀም መድረኩን ለመጠቀም የሚመዘገቡ ግለሰቦች ናቸው። "ልማት ባለሙያ" ማለት መተግበሪያዎችን ለመዘጋጀት እና ለመድረኩ ለመላክ የሚመዘገቡ ግለሰቦች ወይም ድርጅቶች ናቸው።',
    'terms_account': 'መድረካችንን ለመጠቀም መለያ መፍጠር አለብዎት። በምዝገባ ሂደቱ ወቅት ትክክለኛ፣ የአሁኑ እና የተሟላ መረጃ እንዲሰጡ እና እንዲያዘምኑ ይስማማሉ።',
    'terms_user_responsibilities': 'ተጠቃሚዎች የመለያ መረጃቸውን እና የይለፍ ቃላቸውን ሚስጥር ለመጠበቅ ተገዢ ናቸው። ተጠቃሚዎች በመለያቸው ላይ የሚከሰቱ ሁሉንም እንቅስቃሴዎች ተገዢ ናቸው። ተጠቃሚዎች ያልተፈቀደ የመለያ አጠቃቀም ካጋጠማቸው ወዲያውኑ ሊያሳውቁን አለባቸው።',
    'terms_developer_responsibilities': 'ልማት ባለሙያዎች ለመተግበሪያዎቻቸው ይዘት፣ ጥራት እና አፈጻጸም ተገዢ ናቸው። ልማት ባለሙያዎች መተግበሪያዎቻቸው ከመመሪያችን እና ከሚፈቀዱ ህጎች ጋር እንዲስማሙ ማረጋገጥ አለባቸው። ልማት ባለሙያዎች ስለ መተግበሪያዎቻቸው ትክክለኛ መረጃ ማቅረብ እና አስፈላጊ በሚሆንበት ጊዜ ማዘመን አለባቸው።',
    'terms_privacy': 'የግላዊነት ፖሊሲችን መድረካችንን ስንጠቀም መረጃን እንዴት እንሰበስብ፣ እንጠቀም እና እናካፍል እንደሆነ ይገልጻል። መድረካችንን በመጠቀም በግላዊነት ፖሊሲችን እንደተገለጸው መረጃን ለመሰብሰብ እና ለመጠቀም እንደምትስማሙ ይስማማሉ።',
    'terms_ip': 'የመድረካችን ሁሉም ይዘት፣ ባህሪያት እና ተግባራት በእኛ ወይም በፈቃድ ሰጪዎቻችን የተያዙ እና በዓለም አቀፍ የቅጂ መብት፣ የንግድ ምልክት፣ ፓተንት፣ የንግድ ሚስጥር እና ሌሎች የአእምሮ ንብረት ህጎች የተጠበቁ ናቸው።',
    'terms_termination': 'እነዚህን ደረጃዎች የሚጥሱ ወይም ለሌሎች ተጠቃሚዎች፣ ለእኛ ወይም ለሶስተኛ ወገኖች ጎጂ የሆኑ ባህሪያት ላይ በመመስረት ወይም ለማንኛውም ሌላ ምክንያት መለያዎን እና ወደ መድረካችን መዳረሻዎን በራሳችን ውሳኔ ሳያሳውቁ ለማቋረጥ ወይም ለማቆም መብት አለን።',
    'terms_changes': 'ይህን ገጽ በማዘመን እነዚህን ደረጃዎች በማንኛውም ጊዜ ልንሻሻል እንችላለን። እንደዚህ ያሉ ለውጦች ከተደረጉ በኋላ መድረካችንን በመጠቀም በተሻሻሉት ደረጃዎች እንደምትገደዱ ይስማማሉ።',
    'terms_contact': 'ስለእነዚህ ደረጃዎች ጥያቄ ካለዎት፣ እባክዎን በsupport@mgovappstore.com ያግኙን።',
    'terms_back': 'ወደ ምዝገባ ተመለስ',
    
    // About Us
    'about_title': 'ስለ እኛ',
    'about_subtitle': 'በታመኑ መተግበሪያዎች በኩል ዲጂታል ለውጥን ማስተዳደር',
    'about_objectives': 'ዋና ዋና ዓላማዎች',
    'about_objectives_subtitle': 'በተቀናጅበ የመተግበሪያ ገበያ በኩል ልማት ባለሙያዎችን ማስተዳደር እና የተጠቃሚ ልምድን ማሻሻል',
    'about_digital': 'ዲጂታል ለውጥን ማስተዳደር',
    'about_digital_desc': 'የመንግስት አገልግሎቶችን በሙሉ ሂደቶችን ለማቃለል፣ ቅልጥፍናን ለማሻሻል እና ግልጽነትን ለማስተዳደር የሚያግዝ የዘይቤ ቴክኖሎጂዎችን የመቀበል ምድብ ይድገም።',
    'about_security': 'ደህንነት እና አስተማማኝነት ማረጋገጥ',
    'about_security_desc': 'የተጠቃሚ መረጃን የሚጠብቅ እና የደህንነት ከፍተኛ ደረጃዎችን የሚያስገኝ ታመኑ እና የተረጋገጠ መተግበሪያዎችን ማቅረብ።',
    'about_collaboration': 'ሁኔታዎችን እና ፍጥነትን ማሻሻል',
    'about_collaboration_desc': 'ከመንግስት እና ከመንግስት ውጭ ድርጅቶች ጋር በመተባበር የተጠቃሚዎችን የሚያሟሉ የወደፊት አስተዳደር መፍትሄዎችን ለማዘጋጀት።',
    // Categories
    'technology': 'ቴክኖሎጂ',
    'logistics': 'ሎጂስቲክስ',
    'justice': 'የዳኝነት',
    'social': 'ማህበራዊ',
    // Additional About Us translations
    'about_mission_title': 'የእኛ ተልእኮ',
    'about_mission_desc': 'ዜጎችን ከታመኑ የመንግስት መተግበሪያዎች ጋር በማገናኘት፣ ዲጂታል ማካተትን በማስተዳደር እና የህዝብ አገልግሎት መድረስን በማሻሻል ደህንነቱ የተጠበቀ፣ ለተጠቃሚዎች ቀላል የሆነ መድረክ ማቅረብ።',
    'about_vision_title': 'የእኛ ራዕይ',
    'about_vision_desc': 'ለመንግስት አገልግሎቶች ዋና ዲጂታል ገበያ ሆነን በቴክኖሎጂ ዜጎችን በማስተዳደር፣ የበለጠ የተገናኘ፣ ቀልጣፋ እና ግልጽ የህዝብ ዘርፍ መፍጠር።',
    'years': 'የአገልግሎት ዓመታት',
    'apps': 'የሚገኙ መተግበሪያዎች',
    'download_rate': 'የማውረድ መጠን (ኪሎ)',
    'verify_otp':'ኦትፒ አረጋግጥ',
    'industries_served': 'የተገለገሉ ኢንዱስትሪዎች',
    'about_services_title': 'ወደ ታመኑ የመንግስት አገልግሎቶች ያለምንም ተጨማሪ የሚያስፈልግ መድረስ',
    'about_services_desc': 'የመንግስት መተግበሪያ መደብር የህዝብ አገልግሎቶችን እንዴት እንደሚጠቀሙ በማሻሻል ደህንነቱ የተጠበቀ እና ለተጠቃሚዎች ቀላል የሆነ መተግበሪያዎችን የሚያቀርብ ማዕከላዊ መድረክ በማቅረብ አብዮት ያደርጋል። ወሳኝ ሰነዶችን በመድረስ፣ ፈቃዶችን በማስተዳደር ወይም የማህበረሰብ ሀብቶችን በማጥናት ይሁን የተመረጡት መተግበሪያዎቻችን ምቹነት እና አስተማማኝነት ያረጋግጣሉ። ወደ ዲጂታል አስተዳደር እንቅስቃሴውን ይቀላቀሉ እና የወደፊቱን የተሻሻለ የህዝብ አገልግሎት ዛሬ ይሞክሩ።',

    // User/Developer Login/Register
    'sign_up': 'ምዝገባ',
    'sign_in': 'ግባ',
    'sign_up_with_google': 'በጎግል ምዝገባ',
    'sign_in_with_google': 'በጎግል ግባ',
    'already_have_account': 'የምዝገባ መለያ አለዎት?',
    'need_account': 'የምዝገባ መለያ ያስፈልግዎታል?',
    'create_one': 'አንድ ይፍጠሩ',
    'first_name': 'የመጀመሪያ ስም',
    'last_name': 'የአያት ስም',
    'username': 'የተጠቃሚ ስም',
    'password': 'የይለፍ ቃል',
    'confirm_password': 'የይለፍ ቃል አረጋግጥ',
    'mobile_number': 'ስልክ ቁጥር',
    'date_of_birth': 'የልደት ቀን',
    'gender': 'ጾታ',
    'male': 'ወንድ',
    'female': 'ሴት',
    'organization_name': 'የድርጅት ስም',
    'organization_address': 'የድርጅት አድራሻ',
    'organization_website': 'የድርጅት ዌብሳይት',
    'city': 'ከተማ',
    'woreda': 'ወረዳ',
    'zone': 'ዞን',
    'sub_city': 'ክፍለ ከተማ',
    'business_registration_number': 'የንግድ ምዝገባ ቁጥር',
    'citizen_login': 'የዜጋ መግቢያ',
    'developer_login': 'የልማት ባለሙያ መግቢያ',
    'citizen_registration': 'የዜጋ መለያ ምዝገባ',
    'developer_registration': 'የልማት ባለሙያ መለያ ምዝገባ',
    'welcome_message': 'ወደ የመንግስት መተግበሪያ መደብር እንኳን ደህና መጡ',
    'gateway_message': 'ወደ ኦፊሴላዊ አገልግሎቶች እና መፍትሄዎች የሚወስድ መንገድዎ!',
    'please_login': 'ወደ መለያዎ ለመቀጠል እባክዎ ይግቡ።',
    'enter_username': 'የተጠቃሚ ስምዎን ያስገቡ',
    'remember_me': 'አስታውሰኝ',
    'forgot_password': 'የይለፍ ቃልዎን ረሳዎት?',
    'continue': 'ቀጥል',
    'registration_successful': 'ምዝገባው በተሳካ ሁኔታ ተጠናቋል!',
    'account_created': 'መለያዎ በተሳካ ሁኔታ ተፈጥሯል። አሁን ወደ mGov መተግበሪያ መደብር ለመድረስ መግባት ይችላሉ።',
    'go_to_login': 'ወደ መግቢያ ሂድ',
    'close': 'ዝጋ',
    'create_account_message': 'የመለያ ምዝገባዎን ለማጠናቀቅ እባክዎ የሚከተለውን መረጃ ያስገቡ።',
    'registration_instructions': 'የመለያ ምዝገባዎን ለማጠናቀቅ እባክዎ የሚከተለውን መረጃ ያስገቡ።',
    'password_requirements': 'የይለፍ ቃልዎ ቢያንስ 8 ቁምፊዎች መሆን አለበት።',
    'terms_agreement': 'የአገልግሎት ደረጃዎችን እና የግላዊነት ፖሊሲን ያንብቡ እና ይስማማሉ።',
    'already_registered': 'የተመዘገቡ ነዎት?',
    'login_here': 'እዚህ ይግቡ',
    'enter_phone_number': 'የትኛውንም የኢትዮጵያ ስልክ ቁጥር ያስገቡ (ለምሳሌ፣ +251941234567 ወይም 0941234567)',
    'phone_validation': 'እባክዎ የትኛውንም የኢትዮጵያ ስልክ ቁጥር ያስገቡ (+251XXXXXXXXX ወይም 09XXXXXXXX)',
    'password_validation': 'የይለፍ ቃልዎ ቢያንስ 8 ቁምፊዎች መሆን አለበት እና ፊደሎችን እና ቁጥሮችን መያዝ አለበት',
    'terms_required': 'የአገልግሎት ደረጃዎችን እና ሁኔታዎችን መቀበል አለብዎት',
    'captcha_required': 'እባክዎ CAPTCHA ማረጋገጫውን ያጠናቅቁ',
    'registration_failed': 'ምዝገባው አልተሳካም። እባክዎ ዳግም ይሞክሩ።',
    'error_occurred': 'ስህተት ተፈጥሯል። እባክዎ ዳግም ይሞክሩ።',
    'organization_info': 'የድርጅት መረጃ',
    'provide_org_details': 'ምዝገባውን ለማጠናቀቅ የድርጅትዎ ዝርዝሮችን ያቅርቡ',
    'enter_field': '{field} ያስገቡ',
    'field_required': '{field} ያስፈልጋል',
    
    // Developer Portal
    'developer_pending_message': 'የመተግበሪያ መደብር ምዝገባ ጥያቄዎ በግምገማ ላይ ነው። የግምገማ ሂደቱ ሲጠናቀቅ እናሳውቀዎታለን። ለትዕግስትዎ እናመሰግናለን!',
    'developer_rejected_message': 'የምዝገባ ጥያቄዎ ተቀባይነት አላገኘም። እባክዎን መረጃዎን ያስተካክሉ እና እንደገና ይሞክሩ።',
    'developer_approved_message': 'ፈቃድ አግኝተዋል እና መተግበሪያዎን ለማስገባት ዝግጁ ነዎት!',
    'developer_login_message': 'የመተግበሪያ ማስገቢያ ሁኔታዎን ለመመልከት እባክዎን ይግቡ።',
    'developer_registration_review': 'ምዝገባ በግምገማ ላይ',
    'developer_registration_rejection': 'ምዝገባ ተቀባይነት አላገኘም',
    
    // Developer Portal Appstore
    'overview': 'አጠቃላይ እይታ',
    'account_details': 'የመለያ ዝርዝሮች',
    'settings': 'ቅንብሮች',
    'submit_new_app': 'አዲስ መተግበሪያ አስገባ',
    
    // Settings Section
    'account_settings': 'የመለያ ቅንብሮች',
    'change_password': 'የይለፍ ቃል ይቀይሩ',
    'current_password': 'የአሁኑ የይለፍ ቃል',
    'new_password': 'አዲስ የይለፍ ቃል',
    'enter_current_password': 'የአሁኑን የይለፍ ቃልዎን ያስገቡ',
    'current_password_required': 'የአሁኑ የይለፍ ቃል ያስፈልጋል',
    'new_password_required': 'አዲስ የይለፍ ቃል ያስፈልጋል',
    'password_min_length': 'የይለፍ ቃል ቢያንስ 8 ቁምፊዎች መሆን አለበት',
    'confirm_password_required': 'እባክዎ አዲስ የይለፍ ቃልዎን ያረጋግጡ',
    'password_changed_success': 'የይለፍ ቃል በተሳካ ሁኔታ ተቀይሯል',
    'password_change_failed': 'የይለፍ ቃል መቀየር አልተሳካም። እባክዎ እንደገና ይሞክሩ።',
    'password_change_error': 'ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።',
    'processing': 'በሂደት ላይ...',
    'password_requirement_hint': 'የይለፍ ቃል ቢያንስ 8 ቁምፊዎች መሆን አለበት',
    'min_eight_chars': 'ቢያንስ 8 ቁምፊዎች',
    'include_uppercase': 'ቢያንስ አንድ ከፍተኛ ሆሄ ያካትቱ',
    'include_number': 'ቢያንስ አንድ ቁጥር ያካትቱ',
    'include_special_char': 'ቢያንስ አንድ ልዩ ቁምፊ ያካትቱ',
    'password_changed_title': 'የይለፍ ቃል በተሳካ ሁኔታ ተቀይሯል',
    'login_again': 'እንደገና ይግቡ',
    'password_changed_message': 'የይለፍ ቃልዎ ተዘምኗል። እባክዎ በአዲሱ የይለፍ ቃልዎ እንደገና ይግቡ።',
    
    // Account Information Section
    'personal_information': 'የግል መረጃ',
    'address_information': 'የአድራሻ መረጃ',
    'account_organization_details': 'የመለያ እና የድርጅት ዝርዝሮች',
    'organization_information': 'የድርጅት መረጃ',
    
    // App Submission Form
    'app_version': 'የመተግበሪያ ስሪት',
    'supported_platforms': 'የሚደግፉ መድረኮች',
    'previous': 'ቀዳሚ',
    'next': 'ቀጣይ',
    'app_icon': 'የመተግበሪያ አዶ',
    'apk_file': 'APK ፋይል',
    'cover_graphics': 'የሽፋን ንድፎች',
    'add_screenshot': 'የማያ ገጽ ቅጽበታዊ ገጽ ይጨምሩ',
    'description': 'መግለጫ',
    'privacy_policy_url': 'የግላዊነት ፖሊሲ URL',
    'web_portal_url_optional': 'የድር ፖርታል URL (አማራጭ)',
    'otp_verified_successfully': 'ኦትፒ በተሳካ ሁኔታ ተረጋግጧል!',
    'invalid_otp': 'ልክ ያልሆነ ኦትፒ። እባክዎ እንደገና ይሞክሩ።',
    'new_otp_sent': 'አዲስ ኦትፒ ወደ ኢሜይልዎ ተልኳል።',
    'failed_to_resend_otp': 'ኦትፒ እንደገና መላክ አልተሳካም። እባክዎ እንደገና ይሞክሩ።',
    'please_enter_verification_code': 'እባክዎ ወደ ኢሜይልዎ የተላከውን የማረጋገጫ ኮድ ያስገቡ'
  }
};

const LanguageContext = createContext<LanguageState | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize language state with a default value
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage after component mounts
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
    setMounted(true);
  }, []);

  // Update localStorage when language changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('language', language);
    }
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // For UI display - shows Amharic when selected
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // For backend operations - always returns English value
  const getBackendValue = (key: string): string => {
    return translations['en'][key] || key;
  };

  // Don't render children until after hydration to prevent mismatch
  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getBackendValue }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 