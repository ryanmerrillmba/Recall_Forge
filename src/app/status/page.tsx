import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />

      <section className="py-24 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 font-child">
            System Status 🟢
          </h1>
          <p className="text-xl text-gray-600">
            All RecallForge services are operating normally
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-6">
            <Card className="card-enhanced p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-bold text-gray-800">Website & App</span>
                </div>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
            </Card>

            <Card className="card-enhanced p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-bold text-gray-800">AI Question Generation</span>
                </div>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
            </Card>

            <Card className="card-enhanced p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-bold text-gray-800">User Authentication</span>
                </div>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
            </Card>

            <Card className="card-enhanced p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-bold text-gray-800">Progress Tracking</span>
                </div>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              Last updated: Just now • Subscribe to status updates at status@recallforge.com
            </p>
          </div>
        </div>
      </section>

      <Footer variant="landing" />
    </div>
  );
}