import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export default function COPPAPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />

      <section className="py-24 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 font-child">
            COPPA Compliance 🛡️
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            How we protect children's privacy and comply with federal regulations
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <Card className="card-enhanced p-12">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 font-child">What is COPPA?</h2>
              <p>
                The Children's Online Privacy Protection Act (COPPA) is a federal law that protects the privacy of children under 13 years old online. RecallForge is fully compliant with COPPA requirements.
              </p>

              <h3>How We Comply</h3>
              <div className="bg-green-50 p-6 rounded-xl">
                <ul className="space-y-3 text-green-800">
                  <li>✅ <strong>Minimal Data Collection:</strong> We only collect first names and grade levels from children</li>
                  <li>✅ <strong>Parental Consent:</strong> Parents must create and approve all accounts</li>
                  <li>✅ <strong>No Marketing:</strong> We never market directly to children</li>
                  <li>✅ <strong>Data Control:</strong> Parents can review, modify, or delete their child's data anytime</li>
                  <li>✅ <strong>Safe Environment:</strong> No social features or child-to-child communication</li>
                </ul>
              </div>

              <h3>What We Don't Collect</h3>
              <ul>
                <li>Full names or last names</li>
                <li>Home addresses or phone numbers</li>
                <li>Photos or videos</li>
                <li>Social security numbers</li>
                <li>Any biometric information</li>
              </ul>

              <h3>Parent Rights</h3>
              <p>As a parent or guardian, you have the right to:</p>
              <ul>
                <li>Review all personal information we have collected from your child</li>
                <li>Direct us to delete your child's personal information</li>
                <li>Refuse to permit further collection or use of your child's information</li>
                <li>Request changes to your child's information</li>
              </ul>

              <div className="bg-blue-50 p-6 rounded-xl mt-8">
                <h3 className="text-xl font-bold text-blue-800 mb-3">Questions About COPPA?</h3>
                <p className="text-blue-700">
                  Contact our privacy team at privacy@recallforge.com for any questions about our COPPA compliance or your child's data.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer variant="landing" />
    </div>
  );
}