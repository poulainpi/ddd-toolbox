import { lazy, memo, Suspense } from 'react';
import { LoaderCircle, LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

interface LoadableIconProps extends Omit<LucideProps, 'ref'> {
  name: keyof typeof dynamicIconImports;
}

export const LoadableIcon = memo(({ name, ...props }: LoadableIconProps) => {
  const LucideIcon = lazy(dynamicIconImports[name]);

  return (
    <Suspense fallback={<LoaderCircle className="animate-spin" {...props} />}>
      <LucideIcon {...props} />
    </Suspense>
  );
});
