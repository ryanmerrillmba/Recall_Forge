import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />

      <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 font-child">
              Privacy Policy 🛡️
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your family's privacy and your child's safety are our top priorities
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="card-enhanced p-12">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 font-child">COPPA Compliance & Child Safety</h2>
                
                <div className="bg-green-50 p-6 rounded-xl mb-8">
                  <h3 className="text-xl font-bold text-green-800 mb-3">🌟 Key Privacy Protections</h3>
                  <ul className="space-y-2 text-green-700">
                    <li>✅ We only collect first names and grade levels from children</li>
                    <li>✅ No photos, addresses, or personal information</li>
                    <li>✅ Parents control all account settings</li>
                    <li>✅ No social features or child-to-child communication</li>
                    <li>✅ No advertising or marketing to children</li>
                  </ul>
                </div>

                <h3>Information We Collect</h3>
                <p><strong>From Parents/Guardians:</strong></p>
                <ul>
                  <li>Name and email address for account management</li>
                  <li>Billing information for subscription services</li>
                  <li>Usage analytics to improve our service</li>
                </ul>

                <p><strong>From Children (with parental consent):</strong></p>
                <ul>
                  <li>First name only for personalization</li>
                  <li>Grade level for age-appropriate content</li>
                  <li>Learning progress and quiz results</li>
                </ul>

                <h3>How We Use Information</h3>
                <p>We use collected information solely to:</p>
                <ul>
                  <li>Provide and improve our educational services</li>
                  <li>Track learning progress and provide reports to parents</li>
                  <li>Communicate with parents about their account</li>
                  <li>Ensure platform safety and security</li>
                </ul>

                <h3>Information Sharing</h3>
                <p>We never sell, rent, or share personal information with third parties for marketing purposes. We only share information when:</p>
                <ul>
                  <li>Required by law</li>
                  <li>Necessary to protect the safety of our users</li>
                  <li>With service providers who help us operate our platform (under strict confidentiality agreements)</li>
                </ul>

                <h3>Data Security</h3>
                <p>We implement industry-standard security measures including:</p>
                <ul>
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Limited access to personal information</li>
                  <li>Secure data centers with physical and digital protections</li>
                </ul>

                <h3>Your Rights</h3>
                <p>As a parent or guardian, you have the right to:</p>
                <ul>
                  <li>Review all information we have about your child</li>
                  <li>Request deletion of your child's account and data</li>
                  <li>Refuse further collection of your child's information</li>
                  <li>Update or correct any information</li>
                </ul>

                <div className="bg-blue-50 p-6 rounded-xl mt-8">
                  <h3 className="text-xl font-bold text-blue-800 mb-3">📞 Contact Us About Privacy</h3>
                  <p className="text-blue-700">
                    If you have any questions about this privacy policy or want to exercise your rights, 
                    please contact us at privacy@recallforge.com or through our contact form.
                  </p>
                </div>

                <p className="text-sm text-gray-500 mt-8">
                  Last updated: January 2024. We may update this policy occasionally and will notify parents of significant changes.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer variant="landing" />
    </div>
  );
}