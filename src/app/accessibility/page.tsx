import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />

      <section className="py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 font-child">
            Accessibility Statement ♿
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            RecallForge is designed to be accessible to all learners, including children with disabilities
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <Card className="card-enhanced p-12">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 font-child">Our Commitment to Accessibility</h2>
              
              <p>
                We believe every child deserves access to quality education. RecallForge is designed to meet WCAG 2.1 AA accessibility standards.
              </p>

              <h3>Accessibility Features</h3>
              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="font-bold text-blue-800 mb-3">Visual Accessibility</h4>
                  <ul className="text-blue-700 space-y-2">
                    <li>✅ High contrast text and backgrounds</li>
                    <li>✅ Large, child-friendly fonts</li>
                    <li>✅ Scalable text up to 200%</li>
                    <li>✅ Color-blind friendly design</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-6 rounded-xl">
                  <h4 className="font-bold text-green-800 mb-3">Motor Accessibility</h4>
                  <ul className="text-green-700 space-y-2">
                    <li>✅ Large touch targets (44px minimum)</li>
                    <li>✅ Keyboard navigation support</li>
                    <li>✅ No time-based interactions</li>
                    <li>✅ Easy-to-click buttons</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl">
                  <h4 className="font-bold text-purple-800 mb-3">Cognitive Accessibility</h4>
                  <ul className="text-purple-700 space-y-2">
                    <li>✅ Simple, clear language</li>
                    <li>✅ Consistent navigation</li>
                    <li>✅ Error prevention and recovery</li>
                    <li>✅ Reduced motion options</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-6 rounded-xl">
                  <h4 className="font-bold text-orange-800 mb-3">Screen Reader Support</h4>
                  <ul className="text-orange-700 space-y-2">
                    <li>✅ Proper heading structure</li>
                    <li>✅ Alt text for all images</li>
                    <li>✅ ARIA labels and descriptions</li>
                    <li>✅ Semantic HTML markup</li>
                  </ul>
                </div>
              </div>

              <h3>Ongoing Improvements</h3>
              <p>
                We continuously test and improve our accessibility. If you encounter any barriers or have suggestions, 
                please contact us at accessibility@recallforge.com
              </p>

              <div className="bg-yellow-50 p-6 rounded-xl mt-8">
                <h3 className="text-xl font-bold text-yellow-800 mb-3">Need Help?</h3>
                <p className="text-yellow-700">
                  Our support team can help you customize RecallForge for your child's specific accessibility needs. 
                  Contact us for personalized assistance.
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