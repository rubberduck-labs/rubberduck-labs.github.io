import React from 'react';
import * as SimpleIcons from 'simple-icons';

interface TechIconProps {
  name: string;
  className?: string;
}

const techMapping: { [key: string]: string } = {
  'React': 'siReact',
  'Redux': 'siRedux',
  'TypeScript': 'siTypescript',
  'JavaScript': 'siJavascript',
  'Kotlin': 'siKotlin',
  'Java': 'siJava',
  'Python': 'siPython',
  'Go': 'siGo',
  'Node.js': 'siNodedotjs',
  'Vue': 'siVuedotjs',
  'Angular': 'siAngular',
  'AngularJS': 'siAngularjs',
  'Spring': 'siSpring',
  'Spring Boot': 'siSpringboot',
  'Docker': 'siDocker',
  'Kubernetes': 'siKubernetes',
  'OpenShift': 'siRedhatopenshift',
  'Azure': 'siMicrosoftazure',
  'AWS': 'siAmazonaws',
  'PostgreSQL': 'siPostgresql',
  'SQL': 'siPostgresql',
  'GraphQL': 'siGraphql',
  'REST': 'siOpenapiinitiative',
  'OAuth': 'siAuth0',
  'Express': 'siExpress',
  'Ionic': 'siIonic',
  'Cordova': 'siApachecordova',
  'MaterialUI': 'siMui',
  'Terraform': 'siTerraform',
};

export function TechIcon({ name, className = "w-5 h-5" }: TechIconProps) {
  const iconKey = techMapping[name];
  if (!iconKey || !SimpleIcons[iconKey]) return null;

  const icon = SimpleIcons[iconKey];

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d={icon.path} />
    </svg>
  );
}