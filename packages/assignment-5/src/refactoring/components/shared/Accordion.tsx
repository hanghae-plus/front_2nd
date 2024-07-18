import {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  disabled?: boolean;
}

const AccordionContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

export const Accordion = ({
  children,
  open: openFromProps,
  onOpenChange,
  defaultOpen = false,
  disabled = false,
  ...props
}: AccordionProps) => {
  const [open, setOpen] = useState(openFromProps ?? defaultOpen);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (disabled) return;
      setOpen(open);
      onOpenChange?.(open);
    },
    [onOpenChange, disabled]
  );

  const contextValue = useMemo(() => ({ open, setOpen: handleOpenChange }), [open, handleOpenChange]);

  return (
    <AccordionContext.Provider value={contextValue}>
      <div {...props}>{children}</div>
    </AccordionContext.Provider>
  );
};

type AccordionTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

const AccordionTrigger = ({ children, ...props }: AccordionTriggerProps) => {
  const { open, setOpen } = useContext(AccordionContext);

  return (
    <button {...props} onClick={() => setOpen(!open)}>
      {children}
    </button>
  );
};

type AccordionContentProps = HTMLAttributes<HTMLDivElement>;

const AccordionContent = ({ children, ...props }: AccordionContentProps) => {
  const { open } = useContext(AccordionContext);

  return open ? <div {...props}>{children}</div> : null;
};

Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;
