const getClassName = (className, modifiers, additional) => {
    let modifier;
    if ( typeof modifiers === 'string' ) {
        modifier = `${className}--${modifiers}`;
    } else if ( modifiers && modifiers.length ) {
        modifier = modifiers.map((m) => `${className}--${m}`).join(' ');
    } else {
        modifier = undefined;
    }
    return [ className, modifier, additional ].filter((c)=>c !== undefined).join(' ');
};

export { getClassName };
