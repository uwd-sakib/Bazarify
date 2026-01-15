import React from 'react';
import Layout from '../components/Layout';
import FeatureCard from '../components/FeatureCard';
import LockedFeatureCard from '../components/LockedFeatureCard';
import './Roadmap.css';

const Roadmap = () => {
  // Current Features - Live and available now
  const currentFeatures = [
    {
      id: 1,
      title: 'পণ্য ব্যবস্থাপনা',
      description: 'সহজেই আপনার সম্পূর্ণ পণ্য ক্যাটালগ যোগ, সম্পাদনা এবং পরিচালনা করুন। রিয়েল-টাইমে স্টক লেভেল এবং মূল্য ট্র্যাক করুন।',
      status: 'Live',
      locked: false
    },
    {
      id: 2,
      title: 'অর্ডার প্রক্রিয়াকরণ',
      description: 'স্ট্যাটাস ট্র্যাকিং এবং গ্রাহক বিজ্ঞপ্তি সহ সুবিন্যস্ত অর্ডার ব্যবস্থাপনা সিস্টেম।',
      status: 'Live',
      locked: false
    },
    {
      id: 3,
      title: 'গ্রাহক ডেটাবেস',
      description: 'ক্রয় ইতিহাস এবং যোগাযোগের তথ্য সহ বিস্তারিত গ্রাহক রেকর্ড বজায় রাখুন।',
      status: 'Live',
      locked: false
    },
    {
      id: 4,
      title: 'বিক্রয় ড্যাশবোর্ড',
      description: 'সুন্দর ভিজ্যুয়ালাইজেশন সহ আপনার ব্যবসার কর্মক্ষমতার রিয়েল-টাইম বিশ্লেষণ এবং অন্তর্দৃষ্টি।',
      status: 'Live',
      locked: false
    },
    {
      id: 5,
      title: 'AI সহায়ক (মুন্সিজি)',
      description: 'স্মার্ট ব্যবসা উপদেষ্টা যা আপনাকে বাংলায় ডেটা-চালিত সিদ্ধান্ত নিতে সাহায্য করে।',
      status: 'Live',
      locked: false
    },
    {
      id: 6,
      title: 'ইনভেন্টরি সতর্কতা',
      description: 'স্টক লেভেল কম হলে বিজ্ঞপ্তি পান এবং স্মার্ট রিস্টকিং পরামর্শ গ্রহণ করুন।',
      status: 'Live',
      locked: false
    }
  ];

  // Upcoming Features - Planned for near future
  const upcomingFeatures = [
    {
      id: 7,
      title: 'মোবাইল অ্যাপ',
      description: 'চলার পথে আপনার ব্যবসা পরিচালনার জন্য নেটিভ iOS এবং Android অ্যাপ।',
      status: 'Q2 2026',
      locked: false
    },
    {
      id: 8,
      title: 'মাল্টি-স্টোর ব্যবস্থাপনা',
      description: 'কেন্দ্রীয় রিপোর্টিং সহ একটি ড্যাশবোর্ড থেকে একাধিক ব্যবসায়িক অবস্থান পরিচালনা করুন।',
      status: 'Q2 2026',
      locked: false
    },
    {
      id: 9,
      title: 'উন্নত বিশ্লেষণ',
      description: 'ভবিষ্যদ্বাণীমূলক বিশ্লেষণ, ট্রেন্ড পূর্বাভাস এবং AI-চালিত সুপারিশ সহ গভীর অন্তর্দৃষ্টি।',
      status: 'Q3 2026',
      locked: false
    },
    {
      id: 10,
      title: 'পেমেন্ট ইন্টিগ্রেশন',
      description: 'bKash, Nagad এবং অন্যান্য জনপ্রিয় পেমেন্ট পদ্ধতির মাধ্যমে সরাসরি পেমেন্ট গ্রহণ করুন।',
      status: 'Q3 2026',
      locked: false
    },
    {
      id: 11,
      title: 'কর্মচারী ব্যবস্থাপনা',
      description: 'টিম সদস্য যোগ করুন, ভূমিকা নির্ধারণ করুন এবং বিস্তারিত অনুমতি সহ কর্মক্ষমতা ট্র্যাক করুন।',
      status: 'Q3 2026',
      locked: false
    },
    {
      id: 12,
      title: 'স্বয়ংক্রিয় মার্কেটিং',
      description: 'SMS, ইমেল এবং সোশ্যাল মিডিয়ার মাধ্যমে AI-চালিত মার্কেটিং ক্যাম্পেইন।',
      status: 'Q4 2026',
      locked: false
    }
  ];

  // Future Vision - Long-term goals
  const futureVision = [
    {
      id: 13,
      title: 'সরবরাহকারী নেটওয়ার্ক',
      description: 'স্মার্ট অর্ডারিং সহ সরবরাহকারীদের সাথে সরাসরি সংযোগ এবং সংগ্রহ স্বয়ংক্রিয় করুন।',
      status: 'Planned',
      locked: true
    },
    {
      id: 14,
      title: 'AI ভিডিও মার্কেটিং',
      description: 'AI ব্যবহার করে স্বয়ংক্রিয়ভাবে পণ্যের ভিডিও এবং সোশ্যাল মিডিয়া কন্টেন্ট তৈরি করুন।',
      status: 'Planned',
      locked: true
    },
    {
      id: 15,
      title: 'ব্লকচেইন ইনভয়েসিং',
      description: 'ব্লকচেইনে সুরক্ষিত, টেম্পার-প্রুফ ইনভয়েসিং এবং লেনদেন রেকর্ড।',
      status: 'Planned',
      locked: true
    },
    {
      id: 16,
      title: 'AR পণ্য প্রিভিউ',
      description: 'অগমেন্টেড রিয়েলিটি ব্যবহার করে গ্রাহকদের তাদের স্থানে পণ্যগুলি কল্পনা করতে দিন।',
      status: 'Planned',
      locked: true
    },
    {
      id: 17,
      title: 'ভয়েস কমার্স',
      description: 'প্রাকৃতিক ভাষা প্রক্রিয়াকরণ সহ বাংলায় ভয়েস কমান্ডের মাধ্যমে অর্ডার গ্রহণ করুন।',
      status: 'Planned',
      locked: true
    },
    {
      id: 18,
      title: 'গ্লোবাল মার্কেটপ্লেস',
      description: 'অন্তর্নির্মিত লজিস্টিকস এবং মুদ্রা রূপান্তর সহ আন্তর্জাতিকভাবে আপনার পণ্য বিক্রি করুন।',
      status: 'Planned',
      locked: true
    }
  ];

  return (
    <Layout>
      <div className="roadmap-page">
        <div className="roadmap-container">
          {/* Page Header */}
          <div className="roadmap-header">
          <h1 className="roadmap-title">পণ্য রোডম্যাপ</h1>
          <p className="roadmap-subtitle">পরবর্তীতে কী আসছে</p>
        </div>

        {/* Current Features Section */}
        <section className="roadmap-section">
          <h2 className="section-heading">বর্তমান বৈশিষ্ট্যসমূহ</h2>
          <div className="features-grid">
            {currentFeatures.map((feature) => (
              feature.locked ? (
                <LockedFeatureCard
                  key={feature.id}
                  title={feature.title}
                  description={feature.description}
                />
              ) : (
                <FeatureCard
                  key={feature.id}
                  title={feature.title}
                  description={feature.description}
                  status={feature.status}
                />
              )
            ))}
          </div>
        </section>

        {/* Upcoming Features Section */}
        <section className="roadmap-section">
          <h2 className="section-heading">আসন্ন বৈশিষ্ট্যসমূহ</h2>
          <div className="features-grid">
            {upcomingFeatures.map((feature) => (
              feature.locked ? (
                <LockedFeatureCard
                  key={feature.id}
                  title={feature.title}
                  description={feature.description}
                />
              ) : (
                <FeatureCard
                  key={feature.id}
                  title={feature.title}
                  description={feature.description}
                  status={feature.status}
                />
              )
            ))}
          </div>
        </section>

        {/* Future Vision Section */}
        <section className="roadmap-section">
          <h2 className="section-heading">ভবিষ্যৎ পরিকল্পনা</h2>
          <div className="features-grid">
            {futureVision.map((feature) => (
              feature.locked ? (
                <LockedFeatureCard
                  key={feature.id}
                  title={feature.title}
                  description={feature.description}
                />
              ) : (
                <FeatureCard
                  key={feature.id}
                  title={feature.title}
                  description={feature.description}
                  status={feature.status}
                />
              )
            ))}
          </div>
        </section>
      </div>
    </div>
    </Layout>
  );
};

export default Roadmap;
