import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

interface Props {
  onCreate: () => void;
}

export const EmptyState = ({ onCreate }: Props) => (
  <div className="min-h-screen bg-gradient-soft">
    <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
      <Logo />
    </header>
    <main className="mx-auto flex max-w-xl flex-col items-center px-6 pt-20 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.7 }}
        className="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-tide shadow-glow animate-tide"
      >
        <Sparkles className="h-10 w-10 text-primary-foreground" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-display mt-8 text-4xl font-bold tracking-tight md:text-5xl"
      >
        Your first <span className="text-gradient">tide</span> awaits
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 max-w-md text-muted-foreground"
      >
        Tell us a goal you've been putting off. We'll break it into small,
        doable daily tasks so you can finally start moving.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <Button variant="hero" size="xl" onClick={onCreate} className="group">
          Create your first goal
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </main>
  </div>
);
