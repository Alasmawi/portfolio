import Reveal from './ui/Reveal';
import SectionHeader from './ui/SectionHeader';
import CodeSnippet from './ui/CodeSnippet';

const WHOAMI_CODE = `// whoami.go
package main

type Engineer struct {
	Name     string
	Location string
	Focus    []string
	Stack    []string
}

func New() *Engineer {
	return &Engineer{
		Name:     "Abdulla Alasmawi",
		Location: "Bahrain",
		Focus: []string{
			"Cloud", "IoT", "Backend",
		},
		Stack: []string{
			"AWS", "Go", "Python",
		},
	}
}`;

export default function About() {
  return (
    <section id="about" className="border-b border-base-border py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader index="01" id="about" title="About" />

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <Reveal delay={0.1} className="md:col-span-7">
            <p className="text-lg leading-relaxed text-text-muted sm:text-xl">
              I'm a Computer Science graduate specializing in{' '}
              <span className="text-text-primary">Cloud Computing</span> —
              comfortable with AWS, Go, Python, and React, and just as
              comfortable down at the hardware level with ESP32 and MQTT.
              What I actually enjoy is the end-to-end part: wiring up a
              sensor, writing the backend that makes sense of what it
              reports, and building the dashboard someone actually opens to
              check on it.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="md:col-span-5">
            <CodeSnippet filename="whoami.go" code={WHOAMI_CODE} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
